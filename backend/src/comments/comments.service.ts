import { CloudinaryService } from '@/cloudinary/cloudinary.service'
import { Comment, CommentDocument } from '@/comments/comment.schema'
import { CreateCommentDto } from '@/comments/dto/create-comment.dto'
import { UserId } from '@/common/decorators/userId'
import { GenericService } from '@/common/generic/generic.service'
import { checkOwnership } from '@/common/utils/check-owner-ship.util'
import { PinsService } from '@/pins/pins.service'
import { clerkClient } from '@clerk/express'
import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

@Injectable()
export class CommentsService extends GenericService<CommentDocument> {
	constructor(
		@InjectModel(Comment.name) private readonly commentModel: Model<CommentDocument>,
        private readonly pinService: PinsService,
		private readonly cloudinaryService: CloudinaryService
	) {
		super(commentModel)
	}

	async findAll(query: any) {
		const filterKey = ['pin_id', 'parent_id']
		const filter = {}

		for (const key of filterKey) {
			if (query[key]) {
				if (query[key] === 'null') {
					query[key] = null
				}
				filter[key] = query[key]
			}
		}

		const comments: CommentDocument[] = await this.baseFindAll(query, filter)
		const result = await Promise.all(
			comments.map(async (comment: CommentDocument) => {
				const user = await clerkClient.users.getUser(comment.user_id)
				return {
					...comment.toObject(),
					user: {
						username: user.username,
						fullName: user.fullName,
						imageUrl: user.imageUrl
					}
				}
			})
		)

		return result
	}

	async create(userId: string, createCommentDto: CreateCommentDto, image?: Express.Multer.File) {
        const pin = await this.pinService.baseFindOne(createCommentDto.pin_id)

        if(!pin.isAllowedComment) {
            throw new BadRequestException('Comment is not allowed on this pin')
        }

		if (image) {
			const uploadedImage = await this.cloudinaryService.uploadFile(image, userId)
			createCommentDto.image = uploadedImage.secure_url
		}

		const comment = new this.commentModel({
			...createCommentDto,
			user_id: userId
		})

		const parentId = createCommentDto.parent_id
		if (parentId) {
			const parentComment = await this.baseFindOne(parentId)
			const parentCommentId = parentComment.parent_id ? parentComment.parent_id : parentId
			createCommentDto.parent_id = parentCommentId
			await this.commentModel.updateOne({ _id: parentCommentId }, { $inc: { replyCount: 1 } })
		}

		return await comment.save()
	}

	async delete(@UserId() userId: string, id: string) {
		const comment = await this.baseFindOne(id)

		checkOwnership(comment, userId)

		if (comment.parent_id) {
			await this.commentModel.updateOne({ _id: comment.parent_id }, { $inc: { replyCount: -1 } })
		} else {
			const commentChildren = await this.commentModel.find({ parent_id: id }).distinct('_id')
			if (commentChildren.length > 0) {
				await this.commentModel.deleteMany({ _id: { $in: commentChildren } })
			}
		}

        if(comment.image) {
            await this.cloudinaryService.deleteFile(comment.image)
        }

		await this.commentModel.deleteOne({ _id: id })

		return { message: 'Comment deleted successfully' }
	}
}
