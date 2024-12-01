// Controller cơ sở có các thao tác CRUD
// để cho các controller khác kế thừa

import { Get, Post, Param, Body, Delete, Patch } from '@nestjs/common';

export abstract class GenericController<T> {
  constructor(private readonly service: any) {}

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
