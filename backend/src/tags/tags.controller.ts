import { AdminGuard } from '@/common/guard/admin.guard'
import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common'
import { CreateTagDto } from './dto/create-tag.dto'
import { TagsService } from './tags.service'
import { FilterTagDto } from '@/tags/dto/filter-tag-dto'
import { Public } from '@/common/decorators/public'

@Controller('tags')
export class TagsController {
	constructor(private readonly tagsService: TagsService) {}

	@UseGuards(AdminGuard)
	@Post()
	create(@Body() createTagDto: CreateTagDto) {
		return this.tagsService.create(createTagDto)
	}

    @Public()
	@Get()
	findAll(@Query() query: FilterTagDto) {
		return this.tagsService.findAll(query)
	}

	@UseGuards(AdminGuard)
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.tagsService.remove(id)
	}
}
