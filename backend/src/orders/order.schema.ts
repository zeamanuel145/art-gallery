import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

// Define OrderItem schema
export const OrderItemSchema = new MongooseSchema({
  artwork: { type: Types.ObjectId, ref: 'Artwork', required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  subtotal: { type: Number, required: true },
  seller: { type: Types.ObjectId, ref: 'User', required: true }, // added seller
  buyer: { type: Types.ObjectId, ref: 'User', required: true },  // added buyer
}, { _id: false });

// Export TypeScript interface for OrderItem
export interface OrderItem {
  artwork: Types.ObjectId;
  quantity: number;
  price: number;
  subtotal: number;
  seller: Types.ObjectId;
  buyer: Types.ObjectId;
}

// Shipping address schema
export const ShippingAddressSchema = new MongooseSchema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, default: 'Ethiopia' },
}, { _id: false });

// Order schema
@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: String, required: true, unique: true })
  orderNumber: string;

  @Prop({ type: [OrderItemSchema], required: true })
  items: OrderItem[];

  @Prop({ type: Number, required: true })
  subtotal: number;

  @Prop({ type: Number, default: 0 })
  shippingCost: number;

  @Prop({ type: Number, default: 0 })
  tax: number;

  @Prop({ type: Number, required: true })
  total: number;

  @Prop({ type: ShippingAddressSchema, required: true })
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };

  @Prop({ enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' })
  status: string;

  @Prop({ enum: ['card', 'mobile_banking', 'cash_on_delivery'], required: true })
  paymentMethod: string;

  @Prop({ enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' })
  paymentStatus: string;

  @Prop({ type: String })
  paymentTransactionId: string;

  @Prop({ type: Date })
  paidAt: Date;

  @Prop({ type: Date })
  shippedAt: Date;

  @Prop({ type: String })
  trackingNumber: string;

  @Prop({ type: Date })
  deliveredAt: Date;

  @Prop({ type: String })
  notes: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
