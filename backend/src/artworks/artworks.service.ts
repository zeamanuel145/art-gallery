import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Artwork } from './artwork.schema';
import { Order } from './order.schema';

@Injectable()
export class ArtworksService {
  constructor(
    @InjectModel(Artwork.name) private artworkModel: Model<Artwork>,
    @InjectModel(Order.name) private orderModel: Model<Order>
  ) {}

  async create(title: string, description: string, imageUrl: string, artistId: string, price?: number) {
    try {
      const artworkData: any = { title, description, imageUrl, artist: artistId };
      
      if (price !== undefined && price > 0) {
        artworkData.price = price;
        artworkData.forSale = true;
      }
      
      const artwork = new this.artworkModel(artworkData);
      return await artwork.save();
    } catch (error: any) {
      throw new InternalServerErrorException('Failed to create artwork');
    }
  }

  async findAll() {
    try {
      return await this.artworkModel.find().populate('artist', 'username email').populate('comments.user', 'username').exec();
    } catch (error: any) {
      throw new InternalServerErrorException('Failed to fetch artworks');
    }
  }

  async findById(id: string) {
    try {
      const artwork = await this.artworkModel
        .findById(id)
        .populate('artist', 'username email')
        .populate('comments.user', 'username')
        .exec();
      if (!artwork) throw new NotFoundException('Artwork not found');
      return artwork;
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch artwork');
    }
  }

  async toggleLike(id: string, userId: string) {
    try {
      const artwork = await this.artworkModel.findById(id);
      if (!artwork) throw new NotFoundException('Artwork not found');
      
      const hasLiked = artwork.likedBy?.includes(userId as any);
      
      if (hasLiked) {
        return await this.artworkModel.findByIdAndUpdate(
          id,
          { 
            $pull: { likedBy: userId },
            $inc: { likes: -1 }
          },
          { new: true }
        ).populate('artist', 'username email').populate('comments.user', 'username');
      } else {
        return await this.artworkModel.findByIdAndUpdate(
          id,
          { 
            $addToSet: { likedBy: userId },
            $inc: { likes: 1 }
          },
          { new: true }
        ).populate('artist', 'username email').populate('comments.user', 'username');
      }
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to toggle like');
    }
  }

  async addComment(id: string, userId: string, text: string) {
    try {
      return await this.artworkModel
        .findByIdAndUpdate(
          id,
          { $push: { comments: { user: userId, text, createdAt: new Date() } } },
          { new: true }
        )
        .populate('artist', 'username email')
        .populate('comments.user', 'username');
    } catch (error: any) {
      throw new InternalServerErrorException('Failed to add comment');
    }
  }

  async putForSale(id: string, price: number, userId: string) {
    const artwork = await this.artworkModel.findById(id);
    if (!artwork) throw new NotFoundException('Artwork not found');
    if (artwork.artist.toString() !== userId) throw new BadRequestException('Only artist can sell their artwork');
    if (artwork.sold) throw new BadRequestException('Artwork already sold');
    
    return await this.artworkModel.findByIdAndUpdate(
      id,
      { forSale: true, price, owner: userId },
      { new: true }
    );
  }

  async removeFromSale(id: string, userId: string) {
    const artwork = await this.artworkModel.findById(id);
    if (!artwork) throw new NotFoundException('Artwork not found');
    if (artwork.artist.toString() !== userId) throw new BadRequestException('Only artist can modify their artwork');
    
    return await this.artworkModel.findByIdAndUpdate(
      id,
      { forSale: false, price: null },
      { new: true }
    );
  }

  async buyArtwork(id: string, buyerId: string) {
    const artwork = await this.artworkModel.findById(id).populate('artist');
    if (!artwork) throw new NotFoundException('Artwork not found');
    if (!artwork.forSale) throw new BadRequestException('Artwork not for sale');
    if (artwork.sold) throw new BadRequestException('Artwork already sold');
    if (artwork.artist._id.toString() === buyerId) throw new BadRequestException('Cannot buy your own artwork');

    const order = new this.orderModel({
      artwork: id,
      buyer: buyerId,
      seller: artwork.artist._id,
      price: artwork.price,
      status: 'completed'
    });

    await order.save();
    
    return await this.artworkModel
      .findByIdAndUpdate(
      id,
      { sold: true, forSale: false, owner: buyerId },
      { new: true }
    )
      .populate('artist', 'name email')
      .populate('owner', 'name email');
  }

  async getForSale() {
    return await this.artworkModel
      .find({ forSale: true, sold: false })
      .populate('artist', 'name email')
      .exec();
  }

  async getUserPurchases(userId: string) {
    return await this.orderModel
      .find({ buyer: userId })
      .populate('artwork')
      .populate('seller', 'name email')
      .exec();
  }

  async getUserSales(userId: string) {
    return await this.orderModel
      .find({ seller: userId })
      .populate('artwork')
      .populate('buyer', 'name email')
      .exec();
  }
}