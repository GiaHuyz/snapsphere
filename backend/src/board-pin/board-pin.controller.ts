import { BoardPinService } from '@/board-pin/board-pin.service'
import { CreateBoardPinDto } from '@/board-pin/dto/create-board-pin.dto'
import { UserId } from '@/common/decorators/userId'
import { GenericController } from '@/common/generic/generic.controller'
import { Body, Controller, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { BoardPinDocument } from './board-pin.schema'

@ApiTags('board-pin')
@Controller('board-pin')
@ApiBearerAuth()
export class BoardPinController extends GenericController<BoardPinDocument> {
	constructor(private readonly boardPinService: BoardPinService) {
		super(boardPinService)
	}

	@Post()
	async create(
		@UserId() userId: string, 
		@Body() createBoardPinDto: CreateBoardPinDto): Promise<BoardPinDocument> {
		return this.boardPinService.create(userId, createBoardPinDto)
	}

}
