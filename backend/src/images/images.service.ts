import { GenericService } from '@/common/generic/generic.service';
import { Injectable } from '@nestjs/common';
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
}
