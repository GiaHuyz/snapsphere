import { Comment, CommentDocument } from '@/comments/comment.schema'
import { BaseFilterDto } from '@/common/dto/filter-base.dto'
import { GenericService } from '@/common/generic/generic.service'
import { Pin, PinDocument } from '@/pins/pin.schema'
import { clerkClient } from '@clerk/express'
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateLikeDto } from './dto/create-like.dto'
import { Like, LikeDocument } from './like.shema'

@Injectable()
export class LikesService extends GenericService<LikeDocument> {
	constructor(
		@InjectModel(Like.name) private readonly likeModel: Model<LikeDocument>,
		@InjectModel(Comment.name) private readonly commentModel: Model<CommentDocument>,
		@InjectModel(Pin.name) private readonly pinModel: Model<PinDocument>
	) {
		super(likeModel)
	}

	async getUsersLikedPin(id: string, query: BaseFilterDto) {
		const { page = 1, pageSize = 10 } = query
		const likes = await this.likeModel
			.find({ item_id: id })
			.skip((page - 1) * pageSize)
			.limit(pageSize)
			.sort({ createdAt: -1 })
		const users = await Promise.all(
			likes.map(async (like) => {
				const user = await clerkClient.users.getUser(like.user_id)
				return user
			})
		)
		return users
	}

	async create(createLikeDto: CreateLikeDto, userId: string) {
		if (createLikeDto.type == 'comment') {
			const comment = await this.commentModel.findById(createLikeDto.item_id)
			if (!comment) {
				throw new NotFoundException('Comment not found')
			}
			comment.likeCount += 1
			await comment.save()
		} else if (createLikeDto.type == 'pin') {
			const pin = await this.pinModel.findById(createLikeDto.item_id)
			if (!pin || pin.secret) {
				throw new NotFoundException('Pin not found')
			}
			pin.likeCount += 1
			await pin.save()
		}
		return await this.baseCreate({
			...createLikeDto,
			user_id: userId
		})
	}

	async remove(id: string, userId: string) {
		const like = await this.likeModel.findOne({ user_id: userId, item_id: id })

		if (!like) {
			throw new NotFoundException('You have not liked this item')
		}

		if (like.type == 'comment') {
			const comment = await this.commentModel.findById(like.item_id)
			if (!comment) {
				throw new NotFoundException('Comment not found')
			}
			comment.likeCount -= 1
			await comment.save()
		} else if (like.type == 'pin') {
			const pin = await this.pinModel.findById(like.item_id)
			if (!pin) {
				throw new NotFoundException('Pin not found')
			}
			pin.likeCount -= 1
			await pin.save()
		}

		await this.likeModel.deleteOne({ _id: like._id })

		return { message: 'Like deleted successfully' }
	}
}
