import { Public } from '@/common/decorators/public'
import { UserId } from '@/common/decorators/userId'
import { GenericController } from '@/common/generic/generic.controller'
import { MulterInterceptor } from '@/common/interceptors/multer.interceptor'
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UnprocessableEntityException, UploadedFile, UseInterceptors } from '@nestjs/common'
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger'
import { CreatePinDto } from './dto/create-pin.dto'
import { UpdatePinDto } from './dto/update-pin.dto'
import { PinDocument } from './pin.schema'
import { PinsService } from './pins.service'
import { FilterPinDto } from './dto/filter-pin.dto'

@ApiTags('Pins')
@Controller('pins')
export class PinsController extends GenericController<PinDocument> {
	constructor(private readonly pinsService: PinsService) {
		super(pinsService)
	}

	@ApiOperation({ 
		summary: 'Get all pins',
		description: 'Get all pins with optional filters, ' +
			'not required login but only authenticated users can get their own pins'
	})
	@Public()
	@Get()
	async findAll(
		@Query() query: FilterPinDto,
		@UserId() userId?: string): Promise<PinDocument[]> {
		return this.pinsService.findAll(query, userId);
	}

	@ApiOperation({ summary: 'Get a pin by ID' })
	@Public()
	@Get(':id')
	async findOne(@Param('id') id: string): Promise<PinDocument> {
		// TODO: only owner can view their private pin
		return super.baseFindOne(id)
	}

	@ApiBody({ type: CreatePinDto })
	@ApiOperation({
		summary: 'Create a new pin (image)',
		description: 'Only for authenticated users, max file size: 20MB'
	})
	@ApiConsumes('multipart/form-data') // for uploading image
	@UseInterceptors(MulterInterceptor('image')) // get image with name 'image' from request
	@Post()
	async create(
		@UserId() userId: string,
		@UploadedFile() image: Express.Multer.File,
		@Body() createPinDto: CreatePinDto
	) {
        if(!image && !createPinDto.url) {
            throw new UnprocessableEntityException('Image is required')
        }
		return await this.pinsService.create(userId, createPinDto, image)
	}

	@ApiBody({ type: UpdatePinDto })
	@ApiOperation({
		summary: 'Update a pin by ID',
		description:
			'Only for authenticated users, max file size: 20MB, ' +
			'only owner can update their pin, ' +
			'replace the provided fields'
	})
	@ApiConsumes('multipart/form-data') // for uploading image
	@UseInterceptors(MulterInterceptor('image')) // get image with name 'image' from request
	@Patch(':id')
	async update(
		@Param('id') id: string,
		@Body() updatePinDto: UpdatePinDto,
		@UserId() userId: string,
		@UploadedFile() image?: Express.Multer.File
	): Promise<PinDocument> {
		return await this.pinsService.update(id, updatePinDto, userId, image)
	}

	@ApiOperation({ summary: 'Delete a pin by ID' })
	@Delete(':id')
	async delete(@Param('id') id: string, @UserId() userId: string): Promise<void> {
		return await this.pinsService.delete(id, userId)
	}
}
