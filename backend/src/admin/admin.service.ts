import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/user.schema';
import { Artwork } from '../artworks/artwork.schema';
import { Order } from '../orders/order.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Artwork.name) private artworkModel: Model<Artwork>,
    @InjectModel(Order.name) private orderModel: Model<Order>,
  ) {}

  // User Management
  async getAllUsers() {
    return this.userModel.find().select('-password').sort({ createdAt: -1 }).exec();
  }

  async getUserById(userId: string) {
    const user = await this.userModel.findById(userId).select('-password');
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateUser(userId: string, updateData: any) {
    // Don't allow updating password through this endpoint
    delete updateData.password;
    return this.userModel.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');
  }

  async deleteUser(userId: string) {
    const user = await this.userModel.findByIdAndDelete(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return { message: 'User deleted successfully' };
  }

  async updateUserRole(userId: string, role: string) {
    if (!['user', 'admin'].includes(role)) {
      throw new BadRequestException('Invalid role');
    }
    return this.userModel.findByIdAndUpdate(userId, { role }, { new: true }).select('-password');
  }

  // Artwork Management
  async getAllArtworks() {
    return this.artworkModel.find()
      .populate('artist', 'username email name')
      .sort({ createdAt: -1 })
      .exec();
  }

  async getArtworkById(artworkId: string) {
    const artwork = await this.artworkModel.findById(artworkId).populate('artist', 'username email name');
    if (!artwork) {
      throw new NotFoundException('Artwork not found');
    }
    return artwork;
  }

  async updateArtwork(artworkId: string, updateData: any) {
    return this.artworkModel.findByIdAndUpdate(artworkId, updateData, { new: true })
      .populate('artist', 'username email name')
      .exec();
  }

  async deleteArtwork(artworkId: string) {
    const artwork = await this.artworkModel.findByIdAndDelete(artworkId);
    if (!artwork) {
      throw new NotFoundException('Artwork not found');
    }
    return { message: 'Artwork deleted successfully' };
  }

  // Order Management
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

  async getOrderById(orderId: string) {
    const order = await this.orderModel.findById(orderId)
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

  // Statistics
  async getDashboardStats() {
    const [totalUsers, totalArtworks, totalOrders, totalRevenue] = await Promise.all([
      this.userModel.countDocuments(),
      this.artworkModel.countDocuments(),
      this.orderModel.countDocuments(),
      this.orderModel.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]),
    ]);

    const revenue = totalRevenue.length > 0 ? totalRevenue[0].total : 0;

    const pendingOrders = await this.orderModel.countDocuments({ status: 'pending' });
    const completedOrders = await this.orderModel.countDocuments({ status: 'delivered' });

    return {
      totalUsers,
      totalArtworks,
      totalOrders,
      totalRevenue: revenue,
      pendingOrders,
      completedOrders,
    };
  }
}

