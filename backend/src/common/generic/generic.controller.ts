import { Controller, Get, Post, Param, Body, Delete, Patch, NotFoundException, BadRequestException, Put, Query, Req } from '@nestjs/common';
import { GenericService } from './generic.service';
import { Document, Types } from 'mongoose';

// Đảm bảo GenericController nhận vào service có kiểu kế thừa từ GenericService
export abstract class GenericController<T extends Document> {
  constructor(private readonly service: GenericService<T>) { }

  @Get()
  async findAll(@Query() query: any = {}): Promise<T[]> {
    return this.service.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<T> {
    return await this.service.findOne(id);;
  }

  async baseCreate(@Body() createDto: Partial<T>): Promise<T> {
    return this.service.create(createDto);
  }

  async baseUpdate(@Param('id') id: string, @Body() updateDto: Partial<T>): Promise<T> {
    return this.service.baseUpdate(id, updateDto);
  }

  async baseDelete(@Param('id') id: string): Promise<void> {
    return this.service.baseDelete(id);
  }
}
