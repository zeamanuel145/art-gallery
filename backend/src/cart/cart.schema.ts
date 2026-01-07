import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

const CartItemSchema = new MongooseSchema({
  artwork: { type: Types.ObjectId, ref: 'Artwork', required: true },
  quantity: { type: Number, default: 1, min: 1 }
}, { _id: false });

@Schema({ timestamps: true })
export class Cart extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  user: Types.ObjectId;

  @Prop({ type: [CartItemSchema], default: [] })
  items: Array<{
    artwork: Types.ObjectId;
    quantity: number;
  }>;
}

export const CartSchema = SchemaFactory.createForClass(Cart);

