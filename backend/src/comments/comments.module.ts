import { CloudinaryModule } from '@/cloudinary/cloudinary.module'
import { Comment, CommentSchema } from '@/comments/comment.schema'
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { CommentsController } from './comments.controller'
import { CommentsService } from './comments.service'

@Module({
	imports: [MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]), CloudinaryModule],
	controllers: [CommentsController],
	providers: [CommentsService]
})
export class CommentsModule {}
