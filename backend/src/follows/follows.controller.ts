import { UserId } from '@/common/decorators/userId'
import { Controller, Delete, Get, Param, Post, Query } from '@nestjs/common'
import { FollowsService } from './follows.service'
import { Public } from '@/common/decorators/public'

@Controller('follows')
export class FollowsController {
	constructor(private readonly followsService: FollowsService) {}

    @Public()
	@Get()
	findAll(@Query() query: any, @UserId() userId: string) {
		return this.followsService.findAll(query, userId)
	}

	@Post(':id')
	create(@UserId() userId: string, @Param('id') id: string) {
		return this.followsService.create(userId, id)
	}

    @Delete(':id')
    delete(@UserId() userId: string, @Param('id') id: string) {
        return this.followsService.delete(userId, id)
    }
}
