import { AuthGuard } from '@/common/gaurd/auth.guard';
import { Body, Controller, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ImageDocument } from './image.schema';
import { GenericController } from '@/common/generic/generic.controller';
import { ImagesService } from './images.service';
import { CreateImageDto } from './dto/create-image.dto';

@ApiTags('images')
@ApiBearerAuth()
// @UseGuards(AuthGuard) // TODO: Uncomment this line to enable authentication
@Controller('images')
export class ImagesController extends GenericController<ImageDocument> {
  constructor(private readonly imagesService: ImagesService) {
    super(imagesService);
  }

  @Post()
  async create(
    @Body() createImageDto: CreateImageDto
  ): Promise<ImageDocument> {
    return this.imagesService.create(createImageDto as any);
  }

  
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateImageDto: CreateImageDto
  ): Promise<ImageDocument> {
    return this.imagesService.update(id, updateImageDto as any);
  }
}
