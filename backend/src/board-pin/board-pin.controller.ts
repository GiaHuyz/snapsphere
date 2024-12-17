import { BoardPinService } from '@/board-pin/board-pin.service'
import { CreateBoardPinDto } from '@/board-pin/dto/create-board-pin.dto'
import { UserId } from '@/common/decorators/userId'
import { GenericController } from '@/common/generic/generic.controller'
import { Body, Controller, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { BoardPinDocument } from './board-pin.schema'

@ApiTags('board-pin')
@Controller('board-pin')
@ApiBearerAuth()
export class BoardPinController extends GenericController<BoardPinDocument> {
	constructor(private readonly boardPinService: BoardPinService) {
		super(boardPinService)
	}

	@ApiOperation({
		summary: 'Save a pin to a board',
		description: 'Authenticated users can save a pin to a board, '+
		'the pin will be added to the board and the counters will be updated.'+
		'Users can save other\'s pins to their own boards. '+
		'Pins can be saved to multiple boards.'
	})
	@Post()
	async create(
		@UserId() userId: string,
		@Body() createBoardPinDto: CreateBoardPinDto
	): Promise<BoardPinDocument> {
		console.log('userId ' + userId)
		// Ensure the create method is optimized
		return this.boardPinService.create(userId, createBoardPinDto);
	}

}
