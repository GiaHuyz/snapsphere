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

@ApiTags('Pins')
@Controller('pins')
export class PinsController {
	constructor(private readonly pinsService: PinsService) { }

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

	@Post('save-to-board')
	savePinToBoard(@UserId() userId: string, @Body() savePinDto: SavePinDto) {
		return this.pinsService.savePinToBoard(userId, savePinDto)
	}

	@Delete(':id')
	delete(@UserId() userId: string, @Param('id') id: string, @Query('boardId') boardId?: string) {
		if (!isValidObjectId(id)) {
			throw new UnprocessableEntityException('Invalid ID format')
		}
		if (boardId) {
			if (!isValidObjectId(boardId)) {
				throw new UnprocessableEntityException('Invalid ID format')
			}
			return this.pinsService.deleteFromBoard(id, userId, boardId)
		}
		return this.pinsService.deletePin(id, userId)
	}

	@Get('users/:id')
	@Public()
	findAllPinsByUserId(@Param('id') userId: string) {
		return this.pinsService.findAllPinsByUserId(userId)
	}
}
