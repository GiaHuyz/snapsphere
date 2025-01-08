import { BoardPinService } from '@/board-pin/board-pin.service'
import { CreateBoardPinDto } from '@/board-pin/dto/create-board-pin.dto'
import { UserId } from '@/common/decorators/userId'
import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { BoardPinDocument } from './board-pin.schema'
import { FilterBoardPinDto } from './dto/filter-board-pin.dto'

@ApiTags('board-pin')
@Controller('board-pin')
@ApiBearerAuth()
export class BoardPinController {
	constructor(private readonly boardPinService: BoardPinService) {
	}

	@ApiOperation({
		summary: 'Get all pin-board',
		description: 'Get all pin-board relationships'
	})
	@Get()
	async findAll(@Query() query: FilterBoardPinDto, @UserId() userId?: string): Promise<BoardPinDocument[]> {
		return this.boardPinService.findAll(query, userId);
	}

	@ApiOperation({
		summary: 'Save a pin to a board',
		description: 'Authenticated users can save a pin to a board, ' +
			'the pin will be added to the board and the counters will be updated.' +
			'Users can save other\'s pins to their own boards. ' +
			'Pins can be saved to multiple boards.'
	})
	@Post()
	async create(
		@UserId() userId: string,
		@Body() createBoardPinDto: CreateBoardPinDto
	): Promise<BoardPinDocument> {
		return this.boardPinService.create(userId, createBoardPinDto);
	}

	@Delete(':id')
	delete(@UserId() userId: string, @Param('id') id: string) {
		return this.boardPinService.delete(userId, id);
	}

}
