import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { CreateLikeDto } from './dto/create-like.dto'
import { UpdateLikeDto } from './dto/update-like.dto'
import { LikesService } from './likes.service'
import { UserId } from '@/common/decorators/userId'
import { Public } from '@/common/decorators/public'
import { BaseFilterDto } from '@/common/dto/filter-base.dto'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiTags('likes')
@ApiBearerAuth()
@Controller('likes')
export class LikesController {
	constructor(private readonly likesService: LikesService) {}

    @ApiOperation({ summary: 'Get users liked pin' })
    @Public()
    @Get('/:id/users')
    getUsersLikedPin(@Param('id') id: string, @Query() query: BaseFilterDto) {
        return this.likesService.getUsersLikedPin(id, query)
    }

    @ApiOperation({ summary: 'Like a pin or comment' })
	@Post()
	create(@Body() createLikeDto: CreateLikeDto, @UserId() userId: string) {
		return this.likesService.create(createLikeDto, userId)
	}

    @ApiOperation({ summary: 'Unlike a pin or comment' })
	@Delete('/item/:id')
	remove(@Param('id') id: string, @UserId() userId: string) {
		return this.likesService.remove(id, userId)
	}
}
