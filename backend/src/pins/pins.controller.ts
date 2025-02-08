import { IsAdmin } from '@/common/decorators/isAdmin'
import { Public } from '@/common/decorators/public'
import { UserId } from '@/common/decorators/userId'
import { MulterInterceptor } from '@/common/interceptors/multer.interceptor'
import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
	UnprocessableEntityException,
	UploadedFile,
	UseInterceptors
} from '@nestjs/common'
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger'
import { CreatePinDto } from './dto/create-pin.dto'
import { FilterPinDto } from './dto/filter-pin.dto'
import { GetRecommendedPinsDto } from './dto/get-recommended-pins.dto'
import { UpdatePinDto } from './dto/update-pin.dto'
import { PinDocument } from './pin.schema'
import { PinsService } from './pins.service'

@ApiTags('Pins')
@Controller('pins')
export class PinsController {
	constructor(private readonly pinsService: PinsService) {
	}

	@ApiOperation({
		summary: 'Get all pins',
		description:
			'Get all pins with optional filters, ' +
			'not required login but only authenticated users can get their own pins'
	})
	@Public()
	@Get()
	async findAll(@Query() query: FilterPinDto, @UserId() userId?: string, @IsAdmin() isAdmin?: boolean) {
		return this.pinsService.findAll(query, userId, isAdmin)
	}
    
    @ApiOperation({
        summary: 'Get recommended pins for a user',
        description:
            'Get recommended pins for a user based on their tags, ' +
            'required login, ' +
            'only authenticated users can get their own recommended pins'
    })
	@Get('recommended')
	async getRecommendedPins(@Query() query: GetRecommendedPinsDto, @UserId() userId: string) {
		return this.pinsService.getRecommendedPins(userId, query)
	}

	@ApiOperation({ summary: 'Get a pin by ID' })
	@Public()
	@Get(':id')
	async findOne(@Param('id') id: string, @UserId() userId?: string) {
		return await this.pinsService.findOne(id, userId)
	}

	@ApiOperation({
		summary: 'Get similar pins',
		description: 'Get similar pins based on matching tags for a specific pin'
	})
	@Public()
	@Get(':id/similar')
	async getSimilarPins(
		@Param('id') id: string,
		@Query('page') page?: number,
		@Query('pageSize') pageSize?: number
	) {
		return this.pinsService.getSimilarPins(id, page, pageSize)
	}

	@ApiBody({ type: CreatePinDto })
	@ApiOperation({
		summary: 'Create a new pin (image)',
		description: 'Only for authenticated users, max file size: 10MB'
	})
	@ApiConsumes('multipart/form-data') // for uploading image
	@UseInterceptors(MulterInterceptor('image')) // get image with name 'image' from request
	@Post()
	async create(
		@UserId() userId: string,
		@UploadedFile() image: Express.Multer.File,
		@Body() createPinDto: CreatePinDto
	) {
		if (!image && !createPinDto.url) {
			throw new UnprocessableEntityException('Image is required')
		}
		return await this.pinsService.create(userId, createPinDto, image)
	}

	@ApiBody({ type: UpdatePinDto })
	@ApiOperation({
		summary: 'Update a pin by ID',
		description:
			'Only for authenticated users, max file size: 10MB, ' +
			'only owner can update their pin, ' +
			'replace the provided fields'
	})
	@Patch(':id')
	async update(
		@Param('id') id: string,
		@Body() updatePinDto: UpdatePinDto,
		@UserId() userId: string
	): Promise<PinDocument> {
		return await this.pinsService.update(id, updatePinDto, userId)
	}

	@ApiOperation({ summary: 'Delete a pin by ID' })
	@Delete(':id')
	async delete(@Param('id') id: string, @UserId() userId: string, @IsAdmin() isAdmin?: boolean): Promise<void> {
		return await this.pinsService.delete(id, userId, isAdmin)
	}
}
