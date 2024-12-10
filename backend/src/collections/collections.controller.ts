import { CollectionDocument } from '@/collections/collection.schema'
import { CreateCollectionDto } from '@/collections/dto/create-collection.dto'
import { UserId } from '@/decorators/userId'
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { CollectionsService } from './collections.service'
import { UpdateCollectionDto } from '@/collections/dto/update-collection.dto'
import { Public } from '@/decorators/public'
import { User } from '@clerk/express'

@ApiTags('collections')
@ApiBearerAuth()
@Controller('collections')
export class CollectionsController {
	constructor(private readonly collectionsService: CollectionsService) {}

    @Public()
	@Get('/user/:id')
	async findAllByUserId(@UserId() loginedUserId: string, @Param('id') userId: string): Promise<CollectionDocument[]> {
		return this.collectionsService.findAllByUserId(loginedUserId, userId)
	}

    @Post()
    async create(
        @UserId() userId: string,
        @Body() createCollectionDto: CreateCollectionDto
    ): Promise<CollectionDocument> {
        return this.collectionsService.create(userId, createCollectionDto)
    }

	@Patch(':id')
	async update(
		@Param('id') id: string,
		@UserId() userId: string,
		@Body() updateCollectionDto: UpdateCollectionDto
	): Promise<CollectionDocument> {
		return this.collectionsService.update(id, userId, updateCollectionDto)
	}

    @Delete(':id')
    async delete(@UserId() userId: string, @Param('id') id: string): Promise<void> {
        return this.collectionsService.delete(id, userId)
    }
}
