import { CloudinaryModule } from '@/cloudinary/cloudinary.module'
import { Comment, CommentSchema } from '@/comments/comment.schema'
import { LikesModule } from '@/likes/likes.module'
import { PinsModule } from '@/pins/pins.module'
import { forwardRef, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { CommentsController } from './comments.controller'
import { CommentsService } from './comments.service'

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
		CloudinaryModule,
		forwardRef(() => PinsModule),
		forwardRef(() => LikesModule)
	],
	controllers: [CommentsController],
	providers: [CommentsService],
	exports: [CommentsService, MongooseModule]
})
export class CommentsModule {}
