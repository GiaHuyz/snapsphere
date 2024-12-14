import { GenericController } from '@/common/generic/generic.controller'
import { Body, Controller, Delete, Get, Logger, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { CreateImageDto } from './dto/create-image.dto'
import { ImageDocument } from './image.schema'
import { ImagesService } from './images.service'
import { UpdateImageDto } from './dto/update-image.dto'
import { GetImagesDto } from './dto/get-image.dto'
import { Public } from '@/common/decorators/public'
import { log } from 'console'
import { AuthGuard } from '@/common/guard/auth.guard'
import { UserId } from '@/common/decorators/userId'

@ApiTags('images')
@UseGuards(AuthGuard) // Áp dụng Guard
@Controller('images')
export class ImagesController extends GenericController<ImageDocument> {
	constructor(private readonly imagesService: ImagesService) {
		super(imagesService)
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get an image by ID', description: 'Only owner can view their private images' })
	async findOne(
		@Param('id') id: string,
		@UserId() userId: string
	): Promise<ImageDocument> {
	
		console.log('userId', userId);	
		return this.imagesService.findOne(id, userId);
	}

	@Public() // TODO: chỉ cho phép lấy private image nếu là chủ sở hữu
	@Get()
	@ApiOperation({ summary: 'Get all images' })
	async baseFindAll(@Query() query: GetImagesDto): Promise<ImageDocument[]> {
		return this.imagesService.baseFindAll(query)
	}

	@Post("create")
	@ApiOperation({ summary: 'Create a new image', description: 'Only for authenticated users' })
	async create(
		@Body() createImageDto: CreateImageDto,
		@UserId() userId: string): Promise<ImageDocument> {
		log('[DEV]', '[ImagesController.create]', `user with id: ${userId} create an image`)
		return this.imagesService.baseCreate({ ...createImageDto, user_id: userId })
	}

	@Patch(':id')
	@ApiOperation({ summary: "Update the image's fields given" })
	async update(
		@Param('id') id: string,
		@Body() updateImageDto: UpdateImageDto,
		@UserId() userId: string
	): Promise<ImageDocument> {

		return this.imagesService.update(id, updateImageDto as any, userId)
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Delete an image' })
	async delete(
		@Param('id') id: string,
		@UserId() userId: string
	): Promise<void> {
		return this.imagesService.delete(id, userId);
	}

}
