import { CloudinaryService } from '@/cloudinary/cloudinary.service'
import { Comment, CommentDocument } from '@/comments/comment.schema'
import { CreateCommentDto } from '@/comments/dto/create-comment.dto'
import { FilterCommentDto } from '@/comments/dto/filter-comment.dto'
import { UpdateCommentDto } from '@/comments/dto/update-comment.dto'
import { UserId } from '@/common/decorators/userId'
import { GenericService } from '@/common/generic/generic.service'
import { checkOwnership } from '@/common/utils/check-owner-ship.util'
import { Like, LikeDocument } from '@/likes/like.shema'
import { PinsService } from '@/pins/pins.service'
import { clerkClient } from '@clerk/express'
import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import mongoose, { Model } from 'mongoose'

@Injectable()
export class CommentsService extends GenericService<CommentDocument> {
	constructor(
		@InjectModel(Comment.name) private readonly commentModel: Model<CommentDocument>,
		private readonly pinService: PinsService,
		@InjectModel(Like.name) private readonly likeModel: Model<LikeDocument>,
		private readonly cloudinaryService: CloudinaryService
	) {
		super(commentModel)
	}

	async findAll(query: FilterCommentDto, userId?: string) {
		const filterKey = ['pin_id', 'parent_id']
		const filter = {}

		for (const key of filterKey) {
			if (query[key]) {
				filter[key] = mongoose.Types.ObjectId.createFromHexString(query[key])
			}
		}

		if (query['parent_id'] === null) {
			filter['parent_id'] = null
		}

		const comments: CommentDocument[] = await this.baseFindAll(query, filter)
		const result = await Promise.all(
			comments.map(async (comment: CommentDocument) => {
				const user = await clerkClient.users.getUser(comment.user_id)
				let isLiked = false
				if (userId) {
					if (await this.likeModel.findOne({ user_id: userId, item_id: comment._id })) {
						isLiked = true
					}
				}
				return {
					...comment.toObject(),
					isLiked,
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

	async findOne(id: string) {
		const comment = await this.baseFindOne(id)
		return comment
	}

	async create(userId: string, createCommentDto: CreateCommentDto, image?: Express.Multer.File) {
		const pin = await this.pinService.baseFindOne(createCommentDto.pin_id.toString())

		if (!pin.isAllowedComment) {
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
			const parentComment = await this.baseFindOne(parentId.toString())
			const parentCommentId = parentComment.parent_id ? parentComment.parent_id : parentId
			createCommentDto.parent_id = parentCommentId
			await this.commentModel.updateOne({ _id: parentCommentId }, { $inc: { replyCount: 1 } })
		}

		return await comment.save()
	}

	async update(@UserId() userId: string, id: string, updateCommentDto: UpdateCommentDto) {
		const comment = await this.baseFindOne(id)

		checkOwnership(comment, userId)

		return await this.baseUpdate(id, updateCommentDto)
	}

	async delete(@UserId() userId: string, id: string, isAdmin?: boolean) {
		const comment = await this.baseFindOne(id)
		const pin = await this.pinService.baseFindOne(comment.pin_id.toString())

		if (comment.user_id !== userId && pin.user_id !== userId && !isAdmin) {
			throw new BadRequestException('You are not the owner of this comment')
		}

		if (comment.parent_id) {
			await this.commentModel.updateOne({ _id: comment.parent_id }, { $inc: { replyCount: -1 } })
		} else {
			const commentChildren = await this.commentModel.find({ parent_id: id }).distinct('_id')
			if (commentChildren.length > 0) {
				await this.commentModel.deleteMany({ _id: { $in: commentChildren } })
			}
		}

		if (comment.image) {
			await this.cloudinaryService.deleteFile(comment.image)
		}

		await this.commentModel.deleteOne({ _id: id })

		return { message: 'Comment deleted successfully' }
	}
}
