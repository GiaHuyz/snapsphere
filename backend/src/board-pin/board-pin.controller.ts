import { BoardPinService } from '@/board-pin/board-pin.service'
import { CreateBoardPinDto } from '@/board-pin/dto/create-board-pin.dto'
import { UserId } from '@/common/decorators/userId'
import { Body, Controller, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

@ApiTags('board-pin')
@Controller('board-pin')
@ApiBearerAuth()
export class BoardPinController {
	constructor(private readonly boardPinService: BoardPinService) {}

	@Post()
	async create(@UserId() userId: string, @Body() createBoardPinDto: CreateBoardPinDto) {
		return this.boardPinService.create(userId, createBoardPinDto)
	}
}
