import { GenericService } from '@/common/generic/generic.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Image, ImageDocument } from './image.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GetImagesDto } from './dto/get-image.dto';

@Injectable()
export class ImagesService extends GenericService<ImageDocument> {
  constructor(@InjectModel(Image.name) private readonly imageModel: Model<ImageDocument>) {
    super(imageModel);
  }

  async findAll(query: GetImagesDto): Promise<ImageDocument[]> {
    const filters: Record<string, any> = {};

    // Ánh xạ user_id
    if (query.user_id) {
      filters.user_id = query.user_id;
    }

    // Ánh xạ theme
    if (query.theme) {
      filters.theme = query.theme;
    }

    // Ánh xạ tags
    if (query.tags && query.tags.length > 0) {
      filters.tags = { $all: query.tags };
    }

    // Ánh xạ is_public
    if (query.is_public !== undefined) {
      filters.is_public = query.is_public;
    }

    // Ánh xạ search cho description
    if (query.search) {
      filters.description = { $regex: query.search, $options: 'i' }; // Tìm kiếm không phân biệt hoa/thường
    }

    // Truy vấn MongoDB với các filters
    return super.findAll(filters);
  }

  async update(
    id: string,
    updateDto: Partial<ImageDocument>,
    userId: string): Promise<ImageDocument> {
    //------
    // Tạo callback function để kiểm tra xem user có quyền update không
    //------
    const checkOwnership = (image: ImageDocument) => {
      // chủ sở hữu mới được update
      if (image.user_id !== userId) {
        throw new UnauthorizedException(['You are not the owner of this image']);
      }
    }

    // truyền callback function vào hàm baseUpdate
    return super.baseUpdate(id, updateDto, [checkOwnership]);
  }

  async delete(id: string, userId: string): Promise<void> {
    //------
    // Tạo callback function để kiểm tra xem user có quyền xóa không
    //------
    const checkOwnership = (image: ImageDocument) => {
      // chủ sở hữu mới được xóa
      if (image.user_id !== userId) {
        throw new UnauthorizedException(['You are not the owner of this image']);
      }
    }

    // truyền callback function vào hàm baseDelete
    return super.baseDelete(id, [checkOwnership]);
  }
}
