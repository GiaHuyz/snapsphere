import { Follow, FollowSchema } from '@/follows/follow.schema'
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { FollowsController } from './follows.controller'
import { FollowsService } from './follows.service'

@Module({
	imports: [MongooseModule.forFeature([{ name: Follow.name, schema: FollowSchema }])],
	controllers: [FollowsController],
	providers: [FollowsService]
})
export class FollowsModule {}
