import { BoardDocument } from '@/boards/board.schema'
import { CreateBoardDto } from '@/boards/dto/create-board.dto'
import { UpdateBoardDto } from '@/boards/dto/update-board.dto'
import { Public } from '@/common/decorators/public'
import { UserId } from '@/common/decorators/userId'
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { BoardsService } from './boards.service'
import { FilterBoardDto } from './dto/filter-board.dto'

@ApiTags('boards')
@ApiBearerAuth()
@Controller('boards')
export class BoardsController {
	constructor(private readonly boardsService: BoardsService) { }

	@Public()
	@ApiOperation({
		summary: 'Get all board',
		description: 'Get all boards with optional filters, not required login but only authenticated users can get their own boards'
	})
	@Get()
	async findAll(
		@Query() query: FilterBoardDto,
		@UserId() userId?: string
	): Promise<BoardDocument[]> {
		return this.boardsService.findAll(query, userId)
	}

	@Post()
	async create(@UserId() userId: string, @Body() createBoardDto: CreateBoardDto): Promise<BoardDocument> {
		return this.boardsService.create(userId, createBoardDto)
	}

	@Patch(':id')
	async update(
		@Param('id') id: string,
		@UserId() userId: string,
		@Body() updateBoardDto: UpdateBoardDto
	): Promise<BoardDocument> {
		return this.boardsService.update(id, userId, updateBoardDto)
	}

	@Delete(':id')
	async delete(@UserId() userId: string, @Param('id') id: string) {
		return this.boardsService.delete(id, userId)
	}
}
