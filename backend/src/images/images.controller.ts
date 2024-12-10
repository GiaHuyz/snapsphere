import { GenericController } from '@/common/generic/generic.controller'
import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { CreateImageDto } from './dto/create-image.dto'
import { ImageDocument } from './image.schema'
import { ImagesService } from './images.service'
import { UpdateImageDto } from './dto/update-image.dto'
import { GetImagesDto } from './dto/get-image.dto'
import { Public } from '@/decorators/public'

@ApiTags('images')
@Controller('images')
export class ImagesController extends GenericController<ImageDocument> {
	constructor(private readonly imagesService: ImagesService) {
		super(imagesService)
	}

	@Public()
	@Get()
	@ApiOperation({ summary: 'Get all images' })
	async findAll(@Query() query: GetImagesDto): Promise<ImageDocument[]> {
		return this.imagesService.findAll(query)
	}

	@Post()
	async create(@Body() createImageDto: CreateImageDto): Promise<ImageDocument> {
		return this.imagesService.create(createImageDto as any)
	}

	@Public()
	@Patch(':id')
	@ApiOperation({ summary: "Update the image's fields given" })
	async update(@Param('id') id: string, @Body() updateImageDto: UpdateImageDto): Promise<ImageDocument> {
		return this.imagesService.update(id, updateImageDto as any)
	}
}
