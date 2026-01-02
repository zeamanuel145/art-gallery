import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ShippingAddress } from './shipping-address.schema';

@Injectable()
export class ShippingAddressService {
  constructor(
    @InjectModel(ShippingAddress.name) private addressModel: Model<ShippingAddress>,
  ) {}

  async createAddress(userId: string, addressData: any) {
    // If this is set as default, unset other defaults
    if (addressData.isDefault) {
      await this.addressModel.updateMany(
        { user: userId },
        { $set: { isDefault: false } }
      );
    }

    const address = new this.addressModel({
      ...addressData,
      user: userId,
    });

    return address.save();
  }

  async getAddressesByUser(userId: string) {
    return this.addressModel.find({ user: userId }).sort({ isDefault: -1, createdAt: -1 }).exec();
  }

  async getAddressById(addressId: string, userId: string) {
    const address = await this.addressModel.findOne({ _id: addressId, user: userId });
    if (!address) {
      throw new NotFoundException('Address not found');
    }
    return address;
  }

  async updateAddress(addressId: string, userId: string, updateData: any) {
    // If setting as default, unset other defaults
    if (updateData.isDefault) {
      await this.addressModel.updateMany(
        { user: userId, _id: { $ne: addressId } },
        { $set: { isDefault: false } }
      );
    }

    return this.addressModel.findOneAndUpdate(
      { _id: addressId, user: userId },
      updateData,
      { new: true }
    );
  }

  async deleteAddress(addressId: string, userId: string) {
    const address = await this.addressModel.findOneAndDelete({ _id: addressId, user: userId });
    if (!address) {
      throw new NotFoundException('Address not found');
    }
    return address;
  }

  async getDefaultAddress(userId: string) {
    return this.addressModel.findOne({ user: userId, isDefault: true });
  }
}

