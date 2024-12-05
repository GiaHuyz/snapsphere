// image.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true }) // Thêm timestamp để tự động tạo createdAt và updatedAt
export class Image {

  @Prop({ required: true }) // Chủ sở hữu của hình ảnh
  user_id: string;

  @Prop({ required: true }) // Đường dẫn đến hình ảnh
  url: string;

  @Prop({ required: true }) // Mô tả hình ảnh
  description: string;

  @Prop({ required: true }) // Danh sách các tag của hình ảnh (user tags)
  tags: string[];

  @Prop()
  theme: string; // Chủ đề của hình ảnh

  @Prop({ default: false }) // Có công khai không
  is_public: boolean;

  @Prop() // Số lượt xem
  views?: number;
}

// Tạo schema Mongoose
export type ImageDocument = Image & Document;
export const ImageSchema = SchemaFactory.createForClass(Image);
