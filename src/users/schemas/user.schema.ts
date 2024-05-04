import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  refreshToken: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}
export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
