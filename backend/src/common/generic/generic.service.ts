import { Injectable } from '@nestjs/common';
import { Model, Document } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class GenericService<T extends Document> {
  constructor(@InjectModel('T') private readonly model: Model<T>) { }

  // Tìm tất cả các mục
  async baseFindAll(
    query: any,
    queryBuilder?: any,
    populate?: any,
    sort?: any
  ): Promise<T[]> {
    // extract query parameters
    const { from, to, page, pageSize } = query;

    // queryBuilder is an object that contains the query conditions
    queryBuilder = queryBuilder || {};
    if (from) queryBuilder.createdAt = { ...queryBuilder.createdAt, $gte: new Date(from) };
    if (to) queryBuilder.createdAt = { ...queryBuilder.createdAt, $lte: new Date(to) };

    const pageSize2Query = pageSize || 10;
    const page2Query = page || 1;
    const sort2Query = sort || { createdAt: -1 };

    return await this.model
      .find(queryBuilder)
      .sort(sort2Query)
      .limit(pageSize2Query)
      .skip((page2Query - 1) * pageSize2Query)
      .populate(populate)
      .exec();
  }

  // Tìm một mục theo ID
  async baseFindOne(
    id: string,
    additionalConditions?: Array<(document: T) => void>): Promise<T> {
    // Kiểm tra nếu ID không hợp lệ
    if (!this.isValidObjectId(id)) {
      throw new BadRequestException(['Invalid ID format']);
    }

    const document = await this.model.findById(id).exec();

    if (!document) {
      throw new NotFoundException([`${this.model.modelName} with id "${id}" not found`]);
    }

    // Gọi từng callback để kiểm tra điều kiện
    if (additionalConditions) {
      for (const condition of additionalConditions) {
        condition(document); // Thực thi từng điều kiện
      }
    }

    return document;
  }

  // Tạo một mục mới
  async baseCreate(createDto: Partial<T>): Promise<T> {
    const createdItem = new this.model(createDto);
    return createdItem.save();
  }

  /**
   * Updates a document in the database with the given ID and update data.
   * Optionally, additional conditions can be provided to validate the document before updating.
   *
   * @template T - The type of the document.
   * @param {string} id - The ID of the document to update.
   * @param {Partial<T>} updateDto - The data to update the document with.
   * @param {Array<(document: T) => void>} [additionalConditions] - An optional array of callback functions to validate the document before updating.
   * @returns {Promise<T | null>} - A promise that resolves to the updated document, or null if the update failed.
   * @throws {InternalServerErrorException} - Throws an error if the document update fails.
   */
  async baseUpdate(
    id: string,
    updateDto: Partial<T>,
    additionalConditions?: Array<(document: T) => void> // Mảng callback kiểm tra điều kiện
  ): Promise<T | null> {
    try {
      // Sử dụng findOne để kiểm tra tài liệu
      const document = await this.baseFindOne(id);

      // Gọi từng callback để kiểm tra điều kiện
      if (additionalConditions) {
        for (const condition of additionalConditions) {
          condition(document); // Thực thi từng điều kiện
        }
      }

      // Cập nhật tài liệu và trả về tài liệu đã được cập nhật
      const updatedDocument = await this.model
        .findByIdAndUpdate(document._id, updateDto, { new: true })
        .exec();

      if (!updatedDocument) {
        throw new InternalServerErrorException(['Failed to update the document']);
      }

      return updatedDocument;
    } catch (error) {
      throw error; // Ném lại lỗi từ findOne hoặc lỗi không mong đợi
    }
  }


  /**
   * Deletes a document by its ID after optionally checking additional conditions.
   *
   * @template T - The type of the document.
   * @param {string} id - The ID of the document to delete.
   * @param {Array<(document: T) => void>} [additionalConditions] - Optional array of callback functions to check additional conditions on the document before deletion.
   * @returns {Promise<void>} - A promise that resolves when the document is deleted.
   * @throws Will throw an error if the document is not found or if any of the additional conditions throw an error.
   */
  async baseDelete(
    id: string,
    additionalConditions?: Array<(document: T) => void>
  ): Promise<void> {
    try {
      // Sử dụng findOne để kiểm tra tài liệu
      const document = await this.baseFindOne(id);

      // Gọi từng callback để kiểm tra điều kiện
      if (additionalConditions) {
        for (const condition of additionalConditions) {
          condition(document); // Thực thi từng điều kiện
        }
      }

      // Xóa tài liệu sau khi kiểm tra điều kiện
      await this.model.findByIdAndDelete(id).exec();
    } catch (error) {
      throw error; // Ném lại lỗi từ findOne hoặc lỗi khác
    }
  }

  // Helper method để kiểm tra ObjectId hợp lệ
  private isValidObjectId(id: string): boolean {
    const ObjectId = require('mongoose').Types.ObjectId;
    return ObjectId.isValid(id);
  }
}
