import { Injectable } from '@nestjs/common';
import { Model, Document } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class GenericService<T extends Document> {
  constructor(@InjectModel('T') private readonly model: Model<T>) { }

  // Tìm tất cả các mục
  async findAll(): Promise<T[]> {
    return this.model.find().exec();
  }

  // Tìm một mục theo ID
  async findOne(id: string): Promise<T> {
    try {
      // Kiểm tra nếu ID không hợp lệ
      if (!this.isValidObjectId(id)) {
        throw new BadRequestException('Invalid ID format');
      }

      const document = await this.model.findById(id).exec();
      if (!document) {
        throw new NotFoundException('Document not found');
      }

      return document;
    } catch (error) {
      // Nếu lỗi không phải từ NotFoundException hoặc BadRequestException, ném lỗi server
      if (!(error instanceof NotFoundException || error instanceof BadRequestException)) {
        throw new InternalServerErrorException('An unexpected error occurred');
      }
      throw error;
    }
  }

  // Tạo một mục mới
  async create(createDto: Partial<T>): Promise<T> {
    const createdItem = new this.model(createDto);
    return createdItem.save();
  }

  // Cập nhật một mục theo ID
  async update(id: string, updateDto: Partial<T>): Promise<T | null> {
    try {
      // Sử dụng findOne để kiểm tra tài liệu
      const document = await this.findOne(id);

      // Cập nhật tài liệu và trả về tài liệu đã được cập nhật
      const updatedDocument = await this.model
        .findByIdAndUpdate(document._id, updateDto, { new: true })
        .exec();

      if (!updatedDocument) {
        throw new InternalServerErrorException('Failed to update the document');
      }

      return updatedDocument;
    } catch (error) {
      throw error; // Ném lại lỗi từ findOne hoặc lỗi không mong đợi
    }
  }

  // Xóa một mục theo ID
  async delete(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id).exec();
  }

  // Helper method để kiểm tra ObjectId hợp lệ
  private isValidObjectId(id: string): boolean {
    const ObjectId = require('mongoose').Types.ObjectId;
    return ObjectId.isValid(id);
  }
}
