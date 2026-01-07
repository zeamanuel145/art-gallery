import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class ShippingAddress extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: String, required: true })
  fullName: string;

  @Prop({ type: String, required: true })
  phone: string;

  @Prop({ type: String, required: true })
  address: string;

  @Prop({ type: String, required: true })
  city: string;

  @Prop({ type: String, required: true })
  state: string;

  @Prop({ type: String, required: true })
  zipCode: string;

  @Prop({ type: String, default: 'Ethiopia' })
  country: string;

  @Prop({ type: Boolean, default: false })
  isDefault: boolean;

  @Prop({ type: String })
  label: string; // e.g., "Home", "Work", "Office"
}

export const ShippingAddressSchema = SchemaFactory.createForClass(ShippingAddress);

