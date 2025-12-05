import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(userData: { name: string; email: string; password: string }) {
    try {
      const user = new this.userModel(userData);
      return await user.save();
    } catch (error: any) {
      if (error?.code === 11000 && (error?.keyPattern?.email || error?.keyValue?.email)) {
        throw new ConflictException('Email already registered');
      }
      throw error;
    }
  }

  async findByEmail(email: string) {
    // Include password for authentication purposes; schema has select:false
    return this.userModel.findOne({ email }).select('+password');
  }

  async findById(id: string) {
    return this.userModel.findById(id);
  }

  async updateProfile(id: string, updateData: any) {
    return this.userModel.findByIdAndUpdate(id, updateData, { new: true });
  }
}
