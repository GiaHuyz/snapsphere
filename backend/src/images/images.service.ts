import { GenericService } from '@/common/generic/generic.service';
import { Injectable } from '@nestjs/common';
import { Image, ImageDocument } from './image.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ImagesService extends GenericService<ImageDocument> {
  constructor(@InjectModel(Image.name) private readonly imageModel: Model<ImageDocument>) {
    super(imageModel);
  }
}
