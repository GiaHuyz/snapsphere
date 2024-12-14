import { Public } from '@/common/decorators/public'
import { UserId } from '@/common/decorators/userId'
import { MulterInterceptor } from '@/common/interceptors/multer.interceptor'
import { SavePinDto } from '@/pins/dto/save-pin.dto'
import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Query,
	UnprocessableEntityException,
	UploadedFile,
	UseInterceptors
} from '@nestjs/common'
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger'
import { isValidObjectId } from 'mongoose'
import { CreatePinDto } from './dto/create-pin.dto'
import { PinsService } from './pins.service'
import { GenericController } from '@/common/generic/generic.controller'
import { PinDocument } from './pin.schema'

@ApiTags('Pins')
@Controller('pins')
export class PinsController extends GenericController<PinDocument> {
	constructor(private readonly pinsService: PinsService) {
		super(pinsService)
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
		@Body() createPinDto: CreatePinDto) {
		return await this.pinsService.create(userId, createPinDto, image)
	}

}
