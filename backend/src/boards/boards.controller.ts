import { BoardDocument } from '@/boards/board.schema'
import { CreateBoardDto } from '@/boards/dto/create-board.dto'
import { UpdateBoardDto } from '@/boards/dto/update-board.dto'
import { Public } from '@/common/decorators/public'
import { UserId } from '@/common/decorators/userId'
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { BoardsService } from './boards.service'

@ApiTags('boards')
@ApiBearerAuth()
@Controller('boards')
export class BoardsController {
	constructor(private readonly boardsService: BoardsService) { }

	// TODO: hàm này cần phải thêm filter
	@Get()
	@Public()
	async findAll(): Promise<BoardDocument[]> {
		return this.boardsService.findAll({});
	}

	
	@Post()
	async create(
		@UserId() userId: string,
		@Body() createBoardDto: CreateBoardDto
	): Promise<BoardDocument> {
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

	// @Delete(':id')
	// async delete(@UserId() userId: string, @Param('id') id: string): Promise<void> {
	// 	return this.boardsService.delete(id, userId)
	// }
}
