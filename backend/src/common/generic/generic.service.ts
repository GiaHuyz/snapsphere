import { Injectable } from '@nestjs/common';

@Injectable()
export class GenericService<T> {
  private readonly items: T[] = [];

  async findAll(): Promise<T[]> {
    return this.items;
  }

  async findOne(id: string): Promise<T> {
    return this.items.find(item => (item as any).id === id);
  }

  async create(createDto: Partial<T>): Promise<T> {
    const newItem = { ...createDto, id: Date.now().toString() } as T;
    this.items.push(newItem);
    return newItem;
  }

  async update(id: string, updateDto: Partial<T>): Promise<T> {
    const index = this.items.findIndex(item => (item as any).id === id);
    if (index === -1) throw new Error('Item not found');
    this.items[index] = { ...this.items[index], ...updateDto };
    return this.items[index];
  }

  async delete(id: string): Promise<void> {
    const index = this.items.findIndex(item => (item as any).id === id);
    if (index === -1) throw new Error('Item not found');
    this.items.splice(index, 1);
  }
}
