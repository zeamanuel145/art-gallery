import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order } from './order.schema';
import { Payment } from './payment.schema';
import { Artwork } from '../artworks/artwork.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
    @InjectModel(Artwork.name) private artworkModel: Model<Artwork>,
  ) {}

  // Generate unique order number
  async generateOrderNumber(): Promise<string> {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ORD-${timestamp}-${random}`;
  }

  // Create a new order
  async createOrder(userId: string, orderData: any) {
    console.log('OrdersService.createOrder called', { userId, orderData });
    const orderNumber = await this.generateOrderNumber();
    const items: Array<{
      artwork: Types.ObjectId;
      quantity: number;
      price: number;
      subtotal: number;
      seller: Types.ObjectId;
      buyer: Types.ObjectId;
    }> = [];

    // Validate artworks and prepare items
    for (const item of orderData.items) {
      if (!item || !item.artwork) {
        console.error('Invalid order item:', item);
        throw new BadRequestException('Invalid order item');
      }
      const artwork = await this.artworkModel.findById(item.artwork).populate('artist');
      if (!artwork) throw new NotFoundException(`Artwork ${item.artwork} not found`);
      if (!artwork.forSale || artwork.sold) throw new BadRequestException(`Artwork ${artwork.title} is not available for sale`);

      // Resolve artwork id
      const artworkId = artwork._id as Types.ObjectId;

      // Resolve seller id (artist may be populated object or ObjectId)
      let sellerId: Types.ObjectId;
      const artist = (artwork as any).artist;
      if (artist && (artist as any)._id) {
        sellerId = (artist as any)._id as Types.ObjectId;
      } else if (artist && Types.ObjectId.isValid(String(artist))) {
        sellerId = new Types.ObjectId(String(artist));
      } else {
        throw new BadRequestException(`Invalid artist id for artwork ${artworkId}`);
      }

      // Validate buyer/user id
      if (!Types.ObjectId.isValid(String(userId))) {
        console.error('Invalid user id for order:', userId);
        throw new BadRequestException(`Invalid user id: ${String(userId)}`);
      }

      items.push({
        artwork: artworkId,
        quantity: item.quantity,
        price: artwork.price,
        subtotal: artwork.price * item.quantity,
        seller: sellerId,
        buyer: new Types.ObjectId(String(userId)),
      });
    }

    // Create order
    // Debug: inspect prepared items and order payload
    console.log('Prepared order items:', JSON.stringify(items, null, 2));
    const orderPayload = {
      ...orderData,
      items,
      user: new Types.ObjectId(userId),
      orderNumber,
    };
    console.log('Order payload to save:', JSON.stringify(orderPayload, null, 2));

    const order = new this.orderModel(orderPayload);
    await order.save();

    // Create payment
    const payment = new this.paymentModel({
      order: order._id as Types.ObjectId,
      user: new Types.ObjectId(userId),
      amount: orderData.total,
      method: orderData.paymentMethod,
      status: 'pending',
    });
    await payment.save();

    return this.getOrderById((order._id as Types.ObjectId).toString());
  }

  // Get single order by ID
  async getOrderById(orderId: string, userId?: string) {
    const query: any = { _id: orderId };
    if (userId) query.user = new Types.ObjectId(userId);

    const order = await this.orderModel
      .findOne(query)
      .populate({ path: 'items.artwork', populate: { path: 'artist', select: 'username email name' } })
      .populate('user', 'name email username')
      .exec();

    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  // Get all orders of a user
  async getOrdersByUser(userId: string) {
    return this.orderModel
      .find({ user: new Types.ObjectId(userId) })
      .populate({ path: 'items.artwork', populate: { path: 'artist', select: 'username email name' } })
      .sort({ createdAt: -1 })
      .exec();
  }

  // Get all orders (admin)
  async getAllOrders() {
    return this.orderModel
      .find()
      .populate({ path: 'items.artwork', populate: { path: 'artist', select: 'username email name' } })
      .populate('user', 'name email username')
      .sort({ createdAt: -1 })
      .exec();
  }

  // Update order status
  async updateOrderStatus(orderId: string, status: string) {
    const order = await this.orderModel.findById(orderId);
    if (!order) throw new NotFoundException('Order not found');

    const updateData: any = { status };
    if (status === 'shipped' && !order.shippedAt) updateData.shippedAt = new Date();
    if (status === 'delivered' && !order.deliveredAt) updateData.deliveredAt = new Date();

    await this.orderModel.findByIdAndUpdate(orderId, updateData, { new: true }).exec();
    return this.getOrderById(orderId);
  }

  // Update payment status
  async updatePaymentStatus(orderId: string, paymentStatus: string, transactionId?: string) {
    const order = await this.orderModel.findById(orderId);
    if (!order) throw new NotFoundException('Order not found');

    const updateData: any = { paymentStatus };
    if (paymentStatus === 'paid') updateData.paidAt = new Date();
    if (transactionId) updateData.paymentTransactionId = transactionId;

    await this.paymentModel.findOneAndUpdate(
      { order: orderId },
      { status: paymentStatus, transactionId, paidAt: paymentStatus === 'paid' ? new Date() : undefined }
    );

    await this.orderModel.findByIdAndUpdate(orderId, updateData, { new: true }).exec();
    return this.getOrderById(orderId);
  }

  // Add tracking number
  async addTrackingNumber(orderId: string, trackingNumber: string) {
    await this.orderModel.findByIdAndUpdate(orderId, {
      trackingNumber,
      status: 'shipped',
      shippedAt: new Date(),
    }).exec();
    return this.getOrderById(orderId);
  }

  // Cancel order
  async cancelOrder(orderId: string, userId: string) {
    const order = await this.orderModel.findOne({ _id: orderId, user: new Types.ObjectId(userId) });
    if (!order) throw new NotFoundException('Order not found');
    if (order.status === 'shipped' || order.status === 'delivered') throw new BadRequestException('Cannot cancel shipped or delivered orders');

    await this.orderModel.findByIdAndUpdate(orderId, { status: 'cancelled' }).exec();
    return this.getOrderById(orderId);
  }

  // Sales report
  async getSalesReport(startDate?: Date, endDate?: Date) {
    const match: any = {};
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = startDate;
      if (endDate) match.createdAt.$lte = endDate;
    }

    const orders = await this.orderModel.find(match).exec();
    const totalOrders = orders.length;
    const totalRevenue = orders.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + o.total, 0);
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const completedOrders = orders.filter(o => o.status === 'delivered').length;

    return { totalOrders, totalRevenue, pendingOrders, completedOrders, orders };
  }
}
