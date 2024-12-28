import { GenericService } from '@/common/generic/generic.service'
import { Follow, FollowDocument } from '@/follows/follow.schema'
import { clerkClient } from '@clerk/express'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

@Injectable()
export class FollowsService extends GenericService<FollowDocument> {
	constructor(@InjectModel(Follow.name) private readonly followModel: Model<FollowDocument>) {
		super(followModel)
	}

	async findAll(query: any, userId: string) {
		const filterKey = ['follower_id', 'following_id']
		const filter = {}

		for (const key of filterKey) {
			if (query[key]) {
				filter[key] = query[key]
			}
		}

		const follows = await this.baseFindAll(query, filter)

		if (filter['follower_id'] && filter['following_id']) {
			return follows
		}

        // get user details
		const result = await Promise.all(
			follows.map(async (follow) => {
				let userDetails = null
				let isFollowing = false

				if (filter['follower_id'] && !filter['following_id']) {
					const following = await clerkClient.users.getUser(follow.following_id)
					userDetails = {
						id: following.id,
						username: following.username,
						fullName: following.fullName,
						imageUrl: following.imageUrl
					}
					isFollowing = await this.isUserFollowing(userId, follow.following_id)
				} else if (!filter['follower_id'] && filter['following_id']) {
					const follower = await clerkClient.users.getUser(follow.follower_id)
					userDetails = {
						id: follower.id,
						username: follower.username,
						fullName: follower.fullName,
						imageUrl: follower.imageUrl
					}
					isFollowing = await this.isUserFollowing(userId, follow.follower_id)
				}

				return {
					id: follow._id,
					user: userDetails,
					isFollowing
				}
			})
		)

		return result
	}

	async create(follower_id: string, following_id: string) {
		const [user, following] = await Promise.all([
			clerkClient.users.getUser(follower_id),
			clerkClient.users.getUser(following_id)
		])

		if (!user || !following) {
			throw new NotFoundException('User not found')
		}

		if (user.id === following.id) {
			throw new BadRequestException('You cannot follow yourself')
		}

		await Promise.all([
			this.followModel.create({
				follower_id: follower_id,
				following_id: following_id
			}),
			clerkClient.users.updateUser(following_id, {
				unsafeMetadata: {
					followerCount: (following.unsafeMetadata.followersCount as number) + 1 || 1
				}
			}),
			clerkClient.users.updateUser(follower_id, {
				unsafeMetadata: {
					followingCount: (user.unsafeMetadata.followingCount as number) + 1 || 1
				}
			})
		])

		return { message: 'Followed successfully' }
	}

	async delete(follower_id: string, following_id: string) {
		const [user, following] = await Promise.all([
			clerkClient.users.getUser(follower_id),
			clerkClient.users.getUser(following_id)
		])

		if (!user || !following) {
			throw new NotFoundException('User not found')
		}

		if (user.id === following.id) {
			throw new BadRequestException('You cannot follow yourself')
		}

		if (!(await this.followModel.findOne({ follower_id: follower_id, following_id: following_id }))) {
			throw new BadRequestException('You are not following this user')
		}

		await Promise.all([
			this.followModel.deleteOne({ follower_id: follower_id, following_id: following_id }),
			clerkClient.users.updateUser(following_id, {
				unsafeMetadata: {
					followerCount: (user.unsafeMetadata.followersCount as number) - 1
				}
			}),
			clerkClient.users.updateUser(follower_id, {
				unsafeMetadata: {
					followingCount: (following.unsafeMetadata.followingCount as number) - 1
				}
			})
		])

		return { message: 'Unfollowed successfully' }
	}

	private async isUserFollowing(currentUserId: string, targetUserId: string): Promise<boolean> {
		const follow = await this.followModel.findOne({ follower_id: currentUserId, following_id: targetUserId })
		return !!follow
	}
}
