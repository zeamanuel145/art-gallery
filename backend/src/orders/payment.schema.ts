import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Payment extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Order', required: true })
  order: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: Number, required: true })
  amount: number;

  @Prop({ 
    enum: ['card', 'mobile_banking', 'cash_on_delivery'], 
    required: true 
  })
  method: string;

  @Prop({ 
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded'], 
    default: 'pending' 
  })
  status: string;

  @Prop({ type: String })
  transactionId: string;

  @Prop({ type: String })
  cardLast4: string;

  @Prop({ type: String })
  mobileProvider: string;

  @Prop({ type: String })
  mobileNumber: string;

  @Prop({ type: Date })
  paidAt: Date;

  @Prop({ type: Object })
  paymentDetails: Record<string, any>;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);

