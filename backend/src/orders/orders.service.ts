import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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

  async generateOrderNumber(): Promise<string> {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ORD-${timestamp}-${random}`;
  }

  async createOrder(userId: string, orderData: any) {
    const orderNumber = await this.generateOrderNumber();
    
    // Validate artworks exist and are available
    for (const item of orderData.items) {
      const artwork = await this.artworkModel.findById(item.artwork);
      if (!artwork) {
        throw new NotFoundException(`Artwork ${item.artwork} not found`);
      }
      if (!artwork.forSale || artwork.sold) {
        throw new BadRequestException(`Artwork ${artwork.title} is not available for sale`);
      }
    }

    const order = new this.orderModel({
      ...orderData,
      user: userId,
      orderNumber,
    });

    await order.save();

    // Create payment record
    const payment = new this.paymentModel({
      order: order._id,
      user: userId,
      amount: orderData.total,
      method: orderData.paymentMethod,
      status: orderData.paymentMethod === 'cash_on_delivery' ? 'pending' : 'pending',
    });

    await payment.save();

    return this.orderModel.findById(order._id)
      .populate({
        path: 'items.artwork',
        populate: { path: 'artist', select: 'username email name' }
      })
      .populate('user', 'name email username')
      .exec();
  }

  async getOrderById(orderId: string, userId?: string) {
    const query: any = { _id: orderId };
    if (userId) {
      query.user = userId;
    }

    const order = await this.orderModel.findOne(query)
      .populate({
        path: 'items.artwork',
        populate: { path: 'artist', select: 'username email name' }
      })
      .populate('user', 'name email username')
      .exec();

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async getOrdersByUser(userId: string) {
    return this.orderModel.find({ user: userId })
      .populate({
        path: 'items.artwork',
        populate: { path: 'artist', select: 'username email name' }
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async getAllOrders() {
    return this.orderModel.find()
      .populate({
        path: 'items.artwork',
        populate: { path: 'artist', select: 'username email name' }
      })
      .populate('user', 'name email username')
      .sort({ createdAt: -1 })
      .exec();
  }

  async updateOrderStatus(orderId: string, status: string, adminId: string) {
    const order = await this.orderModel.findById(orderId);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const updateData: any = { status };
    
    if (status === 'shipped' && !order.shippedAt) {
      updateData.shippedAt = new Date();
    }
    
    if (status === 'delivered' && !order.deliveredAt) {
      updateData.deliveredAt = new Date();
    }

    return this.orderModel.findByIdAndUpdate(orderId, updateData, { new: true })
      .populate({
        path: 'items.artwork',
        populate: { path: 'artist', select: 'username email name' }
      })
      .populate('user', 'name email username')
      .exec();
  }

  async updatePaymentStatus(orderId: string, paymentStatus: string, transactionId?: string) {
    const order = await this.orderModel.findById(orderId);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const updateData: any = { paymentStatus };
    if (paymentStatus === 'paid') {
      updateData.paidAt = new Date();
    }
    if (transactionId) {
      updateData.paymentTransactionId = transactionId;
    }

    await this.paymentModel.findOneAndUpdate(
      { order: orderId },
      { status: paymentStatus, transactionId, paidAt: paymentStatus === 'paid' ? new Date() : undefined }
    );

    return this.orderModel.findByIdAndUpdate(orderId, updateData, { new: true })
      .populate({
        path: 'items.artwork',
        populate: { path: 'artist', select: 'username email name' }
      })
      .populate('user', 'name email username')
      .exec();
  }

  async addTrackingNumber(orderId: string, trackingNumber: string) {
    return this.orderModel.findByIdAndUpdate(
      orderId,
      { trackingNumber, status: 'shipped', shippedAt: new Date() },
      { new: true }
    )
      .populate({
        path: 'items.artwork',
        populate: { path: 'artist', select: 'username email name' }
      })
      .populate('user', 'name email username')
      .exec();
  }

  async cancelOrder(orderId: string, userId: string) {
    const order = await this.orderModel.findOne({ _id: orderId, user: userId });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status === 'delivered' || order.status === 'shipped') {
      throw new BadRequestException('Cannot cancel shipped or delivered orders');
    }

    return this.orderModel.findByIdAndUpdate(
      orderId,
      { status: 'cancelled' },
      { new: true }
    )
      .populate({
        path: 'items.artwork',
        populate: { path: 'artist', select: 'username email name' }
      })
      .populate('user', 'name email username')
      .exec();
  }

  async getSalesReport(startDate?: Date, endDate?: Date) {
    const match: any = {};
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = startDate;
      if (endDate) match.createdAt.$lte = endDate;
    }

    const orders = await this.orderModel.find(match).exec();
    
    const totalOrders = orders.length;
    const totalRevenue = orders
      .filter(o => o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + o.total, 0);
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const completedOrders = orders.filter(o => o.status === 'delivered').length;

    return {
      totalOrders,
      totalRevenue,
      pendingOrders,
      completedOrders,
      orders,
    };
  }
}

