import { CloudinaryService } from '@/cloudinary/cloudinary.service'
import { Comment, CommentDocument } from '@/comments/comment.schema'
import { CreateCommentDto } from '@/comments/dto/create-comment.dto'
import { GenericService } from '@/common/generic/generic.service'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

@Injectable()
export class CommentsService extends GenericService<CommentDocument> {
	constructor(
		@InjectModel(Comment.name) private readonly commentModel: Model<CommentDocument>,
		private readonly cloudinaryService: CloudinaryService
	) {
		super(commentModel)
	}

	async findAll(query: any): Promise<CommentDocument[]> {
		const queryKey = ['pin_id']
		const queryBuilder = {}

		for (const key of queryKey) {
			if (query[key]) {
				queryBuilder[key] = query[key]
			}
		}

        const comments = await this.baseFindAll(query, queryBuilder)

		return comments
	}

	async create(userId: string, createCommentDto: CreateCommentDto, image?: Express.Multer.File) {
		if (image) {
			const uploadedImage = await this.cloudinaryService.uploadFile(image, userId)
			createCommentDto.image = uploadedImage.secure_url
		}
		const comment = new this.commentModel({
			...createCommentDto,
			user_id: userId,
			parent_id: null
		})
		return await comment.save()
	}
}
