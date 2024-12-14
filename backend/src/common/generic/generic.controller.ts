import { Controller, Get, Post, Param, Body, Delete, Patch, NotFoundException, BadRequestException, Put, Query, Req } from '@nestjs/common';
import { GenericService } from './generic.service';
import { Document, Types } from 'mongoose';

// Đảm bảo GenericController nhận vào service có kiểu kế thừa từ GenericService
export abstract class GenericController<T extends Document> {
  constructor(private readonly service: GenericService<T>) { }

  async baseFindAll(@Query() query: any = {}): Promise<T[]> {
    return this.service.baseFindAll(query);
  }

  async baseFindOne(@Param('id') id: string): Promise<T> {
    return await this.service.baseFindOne(id);;
  }

  async baseCreate(@Body() createDto: Partial<T>): Promise<T> {
    return this.service.baseCreate(createDto);
  }

  async baseUpdate(@Param('id') id: string, @Body() updateDto: Partial<T>): Promise<T> {
    return this.service.baseUpdate(id, updateDto);
  }

  async baseDelete(@Param('id') id: string): Promise<void> {
    return this.service.baseDelete(id);
  }
}
