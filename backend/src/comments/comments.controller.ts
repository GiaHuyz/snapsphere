import { CreateCommentDto } from '@/comments/dto/create-comment.dto'
import { UserId } from '@/common/decorators/userId'
import { MulterInterceptor } from '@/common/interceptors/multer.interceptor'
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common'
import { CommentsService } from './comments.service'
import { Public } from '@/common/decorators/public'
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger'
import { FilterCommentDto } from '@/comments/dto/filter-comment.dto'

@ApiTags('comments')
@ApiBearerAuth()
@Controller('comments')
export class CommentsController {
	constructor(private readonly commentsService: CommentsService) {}

    @ApiQuery({ name: 'pin_id', required: false })
    @Public()
    @Get()
    async findAll(@Query() query: FilterCommentDto, @UserId() userId?: string) {
        return this.commentsService.findAll(query, userId)
    }

	@Post()
	@UseInterceptors(MulterInterceptor('image'))
	async create(
		@UserId() userId: string,
		@Body() createCommentDto: CreateCommentDto,
		@UploadedFile() image?: Express.Multer.File
	) {
		return this.commentsService.create(userId, createCommentDto, image)
	}

    @Patch(':id')
    async update(@UserId() userId: string, @Param('id') id: string, @Body() updateCommentDto: any) {
        return this.commentsService.update(userId, id, updateCommentDto)
    }

    @Delete(':id')
    async delete(@UserId() userId: string, @Param('id') id: string) {
        return this.commentsService.delete(userId, id)
    }
}
