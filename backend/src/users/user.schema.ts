import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  username: string;

  @Prop()
  bio: string;

  @Prop()
  profilePicture: string;

  @Prop()
  phone: string;

  @Prop()
  studio: string;

  @Prop({ enum: ['user', 'admin'], default: 'user' })
  role: string;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);