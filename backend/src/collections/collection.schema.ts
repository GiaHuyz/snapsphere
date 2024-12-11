import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true }) // Sử dụng timestamps để tự động tạo createdAt và updatedAt
export class Collection {
  
  @Prop({ type: Types.ObjectId, required: true, unique: true })
  collection_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  user_id: Types.ObjectId; // ID của người sở hữu collection

  @Prop({ required: true })
  name: string; // Tên của collection

  @Prop({ required: true })
  description: string; // Mô tả ngắn gọn của collection

  @Prop({ type: Date, default: Date.now })
  created_at: Date; // Ngày tạo collection

  @Prop({ type: Date, default: Date.now })
  updated_at: Date; // Ngày cập nhật collection
}

export type CollectionDocument = Collection & Document;
export const CollectionSchema = SchemaFactory.createForClass(Collection);
