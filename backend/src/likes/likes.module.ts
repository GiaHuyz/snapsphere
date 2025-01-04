import { CommentsModule } from '@/comments/comments.module'
import { Like, LikeSchema } from '@/likes/like.shema'
import { PinsModule } from '@/pins/pins.module'
import { forwardRef, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { LikesController } from './likes.controller'
import { LikesService } from './likes.service'

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Like.name, schema: LikeSchema }]),
		forwardRef(() => PinsModule),
		forwardRef(() => CommentsModule)
	],
	controllers: [LikesController],
	providers: [LikesService],
	exports: [MongooseModule]
})
export class LikesModule {}
