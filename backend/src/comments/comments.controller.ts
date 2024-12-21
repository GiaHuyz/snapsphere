import { CreateCommentDto } from '@/comments/dto/create-comment.dto'
import { UserId } from '@/common/decorators/userId'
import { MulterInterceptor } from '@/common/interceptors/multer.interceptor'
import { Body, Controller, Delete, Get, Param, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common'
import { CommentsService } from './comments.service'
import { Public } from '@/common/decorators/public'
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger'

@ApiTags('comments')
@ApiBearerAuth()
@Controller('comments')
export class CommentsController {
	constructor(private readonly commentsService: CommentsService) {}

    @ApiQuery({ name: 'pin_id', required: false })
    @Public()
    @Get()
    async findAll(@Query() query: any) {
        return this.commentsService.findAll(query)
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

    @Delete(':id')
    async delete(@UserId() userId: string, @Param('id') id: string) {
        return this.commentsService.delete(userId, id)
    }
}
