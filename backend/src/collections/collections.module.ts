import { Collection, CollectionSchema } from '@/collections/collection.schema'
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { CollectionsController } from './collections.controller'
import { CollectionsService } from './collections.service'

@Module({
	imports: [MongooseModule.forFeature([{ name: Collection.name, schema: CollectionSchema }])],
	controllers: [CollectionsController],
	providers: [CollectionsService]
})
export class CollectionsModule {}
