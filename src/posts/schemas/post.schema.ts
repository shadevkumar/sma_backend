import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import  { Document, Types } from 'mongoose';

@Schema()
export class Post extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true  })
  author: Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export type PostDocument = Post & Document
export const PostSchema = SchemaFactory.createForClass(Post);

