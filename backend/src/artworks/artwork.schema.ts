import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Artwork extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  artist: Types.ObjectId;

  @Prop({ default: 0 })
  likes: number;

  @Prop([{ type: Types.ObjectId, ref: 'User' }])
  likedBy: Types.ObjectId[];

  @Prop({ default: false })
  forSale: boolean;

  @Prop({ type: Number, default: null })
  price: number;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  owner: Types.ObjectId;

  @Prop({ default: false })
  sold: boolean;

  @Prop([{ 
    user: { type: Types.ObjectId, ref: 'User' },
    text: String,
    createdAt: { type: Date, default: Date.now }
  }])
  comments: Array<{
    user: Types.ObjectId;
    text: string;
    createdAt: Date;
  }>;
}

export const ArtworkSchema = SchemaFactory.createForClass(Artwork);