import { Controller, Get, Post, Param, Body, Delete, Patch, NotFoundException, BadRequestException, Put } from '@nestjs/common';
import { GenericService } from './generic.service';
import { Document, Types } from 'mongoose';

// Đảm bảo GenericController nhận vào service có kiểu kế thừa từ GenericService
export abstract class GenericController<T extends Document> {
  constructor(private readonly service: GenericService<T>) { }

  @Get()
  async findAll(): Promise<T[]> {
    return this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<T> {
    // Kiểm tra nếu id không hợp lệ
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    const document = await this.service.findOne(id);
    if (!document) {
      throw new NotFoundException('Document not found');
    }
    return document;
  }

  @Post()
  async create(@Body() createDto: Partial<T>): Promise<T> {
    return this.service.create(createDto);
  }

  @Put(':id')
  async replace(@Param('id') id: string, @Body() replaceDto: Partial<T>): Promise<T> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    // Cập nhật toàn bộ tài nguyên
    const updatedDocument = await this.service.update(id, replaceDto);
    if (!updatedDocument) {
      throw new NotFoundException('Document not found');
    }
    return updatedDocument;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateDto: Partial<T>): Promise<T> {
    return this.service.update(id, updateDto);
  }


  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.service.delete(id);
  }
}
