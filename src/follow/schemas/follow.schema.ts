import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

export enum FollowStatus {
  Pending = 'pending',
  Accepted = 'accepted',
}

@Schema()
export class Follow extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  follower: Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  following: Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ enum: FollowStatus, default: FollowStatus.Pending })
  status: FollowStatus;
}

export type FollowDocument = Follow & Document;
export const FollowSchema = SchemaFactory.createForClass(Follow);
FollowSchema.index({ follower: 1, following: 1 });
