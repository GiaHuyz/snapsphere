import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Tag, TagSchema } from './tag.schema'
import { TagsController } from './tags.controller'
import { TagsService } from './tags.service'

@Module({
	imports: [MongooseModule.forFeature([{ name: Tag.name, schema: TagSchema }])],
	controllers: [TagsController],
	providers: [TagsService],
    exports: [MongooseModule]
})
export class TagsModule {}
