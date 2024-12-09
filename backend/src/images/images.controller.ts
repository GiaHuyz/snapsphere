import { GenericController } from '@/common/generic/generic.controller'
import { Body, Controller, Param, Patch, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { CreateImageDto } from './dto/create-image.dto'
import { ImageDocument } from './image.schema'
import { ImagesService } from './images.service'
import { UpdateImageDto } from './dto/update-image.dto'

@ApiTags('images')
@ApiBearerAuth()
// @UseGuards(AuthGuard) // TODO: Uncomment this line to enable authentication
@Controller('images')
export class ImagesController extends GenericController<ImageDocument> {
	constructor(private readonly imagesService: ImagesService) {
		super(imagesService)
	}

	@Post()
	async create(@Body() createImageDto: CreateImageDto): Promise<ImageDocument> {
		return this.imagesService.create(createImageDto as any)
	}

	@Patch(':id')
	@ApiOperation({ summary: "Update the image's fields given" })
	async update(@Param('id') id: string, @Body() updateImageDto: UpdateImageDto): Promise<ImageDocument> {
		return this.imagesService.update(id, updateImageDto as any)
	}
}
