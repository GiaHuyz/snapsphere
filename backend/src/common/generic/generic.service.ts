import { Injectable } from '@nestjs/common';
import { Model, Document } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class GenericService<T extends Document> {
  constructor(@InjectModel('T') private readonly model: Model<T>) {}

  // Tìm tất cả các mục
  async findAll(): Promise<T[]> {
    return this.model.find().exec();
  }

  // Tìm một mục theo ID
  async findOne(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  // Tạo một mục mới
  async create(createDto: Partial<T>): Promise<T> {
    const createdItem = new this.model(createDto);
    return createdItem.save();
  }

  // Cập nhật một mục theo ID
  async update(id: string, updateDto: Partial<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, updateDto, { new: true }).exec();
  }

  // Xóa một mục theo ID
  async delete(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id).exec();
  }
}
