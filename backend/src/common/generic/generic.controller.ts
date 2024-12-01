import { Controller, Get, Post, Param, Body, Delete, Patch } from '@nestjs/common';
import { GenericService } from './generic.service';
import { Document } from 'mongoose';

// Đảm bảo GenericController nhận vào service có kiểu kế thừa từ GenericService
export abstract class GenericController<T extends Document> {
  constructor(private readonly service: GenericService<T>) {}

  @Get()
  async findAll(): Promise<T[]> {
    return this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<T> {
    return this.service.findOne(id);
  }

  @Post()
  async create(@Body() createDto: Partial<T>): Promise<T> {
    return this.service.create(createDto);
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
