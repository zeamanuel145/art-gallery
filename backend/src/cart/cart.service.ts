import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart } from './cart.schema';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
  ) {}

  async getCart(userId: string) {
    let cart = await this.cartModel.findOne({ user: userId })
      .populate({
        path: 'items.artwork',
        populate: { path: 'artist', select: 'username email' }
      })
      .exec();
    
    if (!cart) {
      cart = new this.cartModel({ user: userId, items: [] });
      await cart.save();
      // Populate after creation
      cart = await this.cartModel.findById(cart._id)
        .populate({
          path: 'items.artwork',
          populate: { path: 'artist', select: 'username email' }
        })
        .exec();
    }
    
    return cart;
  }

  async addItem(userId: string, artworkId: string, quantity: number = 1) {
    let cart = await this.cartModel.findOne({ user: userId }).exec();
    
    if (!cart) {
      cart = new this.cartModel({ user: userId, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.artwork.toString() === artworkId
    );

    if (existingItemIndex >= 0) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({ artwork: artworkId as any, quantity });
    }

    await cart.save();
    return this.cartModel.findById(cart._id)
      .populate({
        path: 'items.artwork',
        populate: { path: 'artist', select: 'username email' }
      })
      .exec();
  }

  async updateItemQuantity(userId: string, artworkId: string, quantity: number) {
    const cart = await this.cartModel.findOne({ user: userId }).exec();
    
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.artwork.toString() === artworkId
    );

    if (itemIndex < 0) {
      throw new NotFoundException('Item not found in cart');
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    return this.cartModel.findById(cart._id)
      .populate({
        path: 'items.artwork',
        populate: { path: 'artist', select: 'username email' }
      })
      .exec();
  }

  async removeItem(userId: string, artworkId: string) {
    const cart = await this.cartModel.findOne({ user: userId }).exec();
    
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    cart.items = cart.items.filter(
      (item) => item.artwork.toString() !== artworkId
    );

    await cart.save();
    return this.cartModel.findById(cart._id)
      .populate({
        path: 'items.artwork',
        populate: { path: 'artist', select: 'username email' }
      })
      .exec();
  }

  async clearCart(userId: string) {
    const cart = await this.cartModel.findOne({ user: userId }).exec();
    
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    cart.items = [];
    await cart.save();
    return this.cartModel.findById(cart._id)
      .populate({
        path: 'items.artwork',
        populate: { path: 'artist', select: 'username email' }
      })
      .exec();
  }
}

