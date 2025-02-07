import { BoardPin, BoardPinDocument } from '@/board-pin/board-pin.schema'
import { Board, BoardDocument } from '@/boards/board.schema'
import { ClarifaiService } from '@/clarifai/clarifai.service'
import { GenericService } from '@/common/generic/generic.service'
import { buildRangeFilter } from '@/common/utils/build-range-filter'
import { checkOwnership } from '@/common/utils/check-owner-ship.util'
import { Like, LikeDocument } from '@/likes/like.shema'
import { Tag, TagDocument } from '@/tags/tag.schema'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Cache } from 'cache-manager'
import { Model } from 'mongoose'
import { CloudinaryService } from '../cloudinary/cloudinary.service'
import { CreatePinDto } from './dto/create-pin.dto'
import { FilterPinDto } from './dto/filter-pin.dto'
import { GetRecommendedPinsDto } from './dto/get-recommended-pins.dto'
import { UpdatePinDto } from './dto/update-pin.dto'
import { Pin, PinDocument } from './pin.schema'

@Injectable()
export class PinsService extends GenericService<PinDocument> {
	constructor(
		@InjectModel(Pin.name) private readonly pinModel: Model<PinDocument>,
		@InjectModel(Board.name) private readonly boardModel: Model<BoardDocument>,
		@InjectModel(BoardPin.name) private readonly boardPinModel: Model<BoardPinDocument>,
		@InjectModel(Like.name) private readonly likeModel: Model<LikeDocument>,
		@InjectModel(Tag.name) private readonly tagModel: Model<TagDocument>,
		private readonly clarifaiService: ClarifaiService,
		private readonly cloudinaryService: CloudinaryService,
		@Inject(CACHE_MANAGER) private cacheManager: Cache
	) {
		super(pinModel)
	}

	async findAll(query: FilterPinDto, userId: string, isAdmin: boolean) {
		// Only cache if there's a search query
		const shouldCache = !!query.search;
		const cacheKey = shouldCache ? `pins:search:${query.search}:${userId}:${isAdmin}` : null;

		// Try to get data from cache only if we should cache
		if (shouldCache) {
			const cachedData = await this.cacheManager.get(cacheKey)
			if (cachedData) return cachedData
		}

		// extract query parameters
		const {
			user_id,
			title,
			description,
			saveCountMin,
			saveCountMax,
			likeCountMin,
			likeCountMax,
			commentCountMin,
			commentCountMax,
			search
		} = query
		// build filter conditions
		const filter: any = {}

		if (user_id) filter.user_id = user_id
		if (title) filter.title = { $regex: title, $options: 'i' }
		if (description) filter.description = { $regex: description, $options: 'i' }

		// Add range filters only if they are valid
		const saveCountFilter = buildRangeFilter(saveCountMin, saveCountMax)
		const likeCountFilter = buildRangeFilter(likeCountMin, likeCountMax)
		const commentCountFilter = buildRangeFilter(commentCountMin, commentCountMax)

		if (saveCountFilter) filter.saveCount = saveCountFilter
		if (likeCountFilter) filter.likeCount = likeCountFilter
		if (commentCountFilter) filter.commentCount = commentCountFilter
		if (search) {
			// title, description, tags
			filter.$or = [
				{ title: { $regex: `.*${search}.*`, $options: 'i' } },
				{ description: { $regex: `.*${search}.*`, $options: 'i' } },
				{ tags: { $regex: `.*${search}.*`, $options: 'i' } }
			]
		}

		if (userId !== user_id && !isAdmin) filter.secret = false

		const data = await this.baseFindAll(query, filter)
		const totalItems = await this.pinModel.countDocuments(filter)

		const result = { data, totalPages: Math.ceil(totalItems / (query.pageSize || 10)) }

		// Store in cache only if we should cache
		if (shouldCache) {
			await this.cacheManager.set(cacheKey, result)
		}

		return result
	}

	/**
	 * Creates a new pin.
	 *
	 * @param userId - The ID of the user creating the pin.
	 * @param createPinDto - The data transfer object containing the details of the pin to be created.
	 * @param image - The image file to be uploaded and associated with the pin.
	 * @returns A promise that resolves to the created pin document.
	 */
	async create(userId: string, createPinDto: CreatePinDto, image: Express.Multer.File): Promise<PinDocument> {
		const uploadedImageUrl = image
			? (await this.cloudinaryService.uploadFile(image, userId)).secure_url
			: createPinDto.url

		const generatedTags = await this.clarifaiService.generateTags(uploadedImageUrl)

		const newTags = [...new Set(createPinDto.tags?.concat(generatedTags))]

		const [newPin] = await Promise.all([
			this.pinModel.create({
				...createPinDto,
				url: uploadedImageUrl,
				user_id: userId,
				tags: newTags
			}),
			this.tagModel.bulkWrite(
				newTags.map((tagName) => ({
					updateOne: {
						filter: { name: tagName },
						update: { $setOnInsert: { name: tagName } },
						upsert: true
					}
				}))
			)
		])

		return newPin
	}

	async findOne(id: string, userId?: string) {
		const pin = await this.baseFindOne(id)
		let isLiked = false
		if (userId) {
			if (pin.secret && userId !== pin.user_id) throw new NotFoundException('Pin not found')
			if (await this.likeModel.findOne({ item_id: pin._id, user_id: userId })) {
				isLiked = true
			}
		}
		return { ...pin.toObject(), isLiked }
	}

	/**
	 * Updates a pin with the given data.
	 *
	 * @param {string} id - The ID of the pin to update.
	 * @param {UpdatePinDto} updatedPinDto - The data to update the pin with.
	 * @param {string} userId - The ID of the user performing the update.
	 * @param {Express.Multer.File} [image] - An optional new image file to update the pin with.
	 * @returns {Promise<PinDocument>} - The updated pin document.
	 *
	 * @throws {Error} If the pin does not exist.
	 * @throws {Error} If the user is not the owner of the pin.
	 */
	async update(id: string, updatedPinDto: UpdatePinDto, userId: string): Promise<PinDocument> {
		// check if the pin exists
		const pin = await super.baseFindOne(id)

		// check if the user is the owner of the pin
		checkOwnership(pin, userId)

		// update the pin with the new data
		pin.set(updatedPinDto)
		const updatedPin = await pin.save()

		return updatedPin
	}

	async delete(id: string, userId: string, isAdmin?: boolean): Promise<void> {
		// check if the pin exists
		const pin = await super.baseFindOne(id)

		// check if the user is the owner of the pin
		if (!isAdmin) checkOwnership(pin, userId)

		const boardIds = await this.boardPinModel.find({ pin_id: pin._id }).distinct('board_id')

		await Promise.all([
			// delete the image from Cloudinary
			this.cloudinaryService.deleteFile(pin.url),
			// remove cover image from all boards
			this.boardModel.updateMany({ coverImages: pin._id }, { $pull: { coverImages: pin._id } }),
			this.boardModel.updateMany({ _id: { $in: boardIds } }, { $inc: { pinCount: -1 } }),
			// delete the pin from the database
			this.pinModel.findByIdAndDelete(id),
			this.boardPinModel.deleteMany({ pin_id: pin._id }),
            this.likeModel.deleteMany({ item_id: pin._id })
		])
	}

	/**
	 * Get recommended pins for a user based on their interactions
	 * Optimized for large datasets by:
	 * 1. Using limit in queries to reduce data load
	 * 2. Combining queries using $lookup
	 * 3. Using simpler scoring mechanism
	 * 4. Implementing Redis caching for faster responses
	 */
	async getRecommendedPins(userId: string, query: GetRecommendedPinsDto) {
		const { page = 1, pageSize = 10 } = query
		const cacheKey = `recommendations:${userId}:${page}:${pageSize}`

		// Try to get recommendations from cache
		const cachedRecommendations = await this.cacheManager.get(cacheKey)
		if (cachedRecommendations) return cachedRecommendations

		const skip = (page - 1) * pageSize

		// Get user's recent interactions in a single aggregation
		const userInteractions = await this.pinModel.aggregate([
			{
				$facet: {
					// Get user's recently created pins (limited to last 50)
					recentCreated: [
						{ $match: { user_id: userId, secret: false } },
						{ $sort: { created_at: -1 } },
						{ $limit: 50 },
						{ $project: { _id: 1, tags: 1 } }
					],
					// Get user's recently saved pins (limited to last 50)
					recentSaved: [
						{
							$lookup: {
								from: 'boardpins',
								let: { pinId: '$_id' },
								pipeline: [
									{
										$match: {
											$expr: {
												$and: [{ $eq: ['$pin_id', '$$pinId'] }, { $eq: ['$secret', false] }]
											}
										}
									},
									{
										$lookup: {
											from: 'boards',
											let: { boardId: '$board_id' },
											pipeline: [
												{
													$match: {
														$expr: {
															$and: [
																{ $eq: ['$_id', '$$boardId'] },
																{ $eq: ['$user_id', userId] },
																{ $eq: ['$secret', false] }
															]
														}
													}
												}
											],
											as: 'board'
										}
									},
									{ $match: { board: { $ne: [] } } }
								],
								as: 'savedBy'
							}
						},
						{ $match: { savedBy: { $ne: [] } } },
						{ $sort: { created_at: -1 } },
						{ $limit: 50 },
						{ $project: { _id: 1, tags: 1 } }
					]
				}
			}
		])

		// Extract unique tags from recent interactions
		const recentPins = [...userInteractions[0].recentCreated, ...userInteractions[0].recentSaved]
		const recentTags = [...new Set(recentPins.flatMap((p) => p.tags))]
		const excludePinIds = recentPins.map((p) => p._id)

		// Get recommendations using a simpler scoring system
		let recommendedPins = await this.pinModel.aggregate([
			{
				$match: {
					_id: { $nin: excludePinIds },
					user_id: { $ne: userId },
					secret: false,
					tags: { $in: recentTags } // Only get pins with matching tags
				}
			},
			{
				$addFields: {
					// Simple scoring based on matching tags and popularity
					matchingTags: {
						$size: { $setIntersection: ['$tags', recentTags] }
					},
					popularity: {
						$add: [{ $ifNull: ['$saveCount', 0] }, { $ifNull: ['$likeCount', 0] }]
					}
				}
			},
			{
				$addFields: {
					score: {
						$add: ['$matchingTags', { $divide: ['$popularity', 100] }]
					}
				}
			},
			{ $sort: { score: -1 } },
			{ $skip: skip },
			{ $limit: pageSize },
			{
				$project: {
					matchingTags: 0,
					popularity: 0,
					score: 0
				}
			}
		])

		// If no recommendations found, return all public pins except user's own pins
		if (recommendedPins.length === 0) {
			recommendedPins = await this.pinModel.aggregate([
				{
					$match: {
						user_id: { $ne: userId },
						secret: false
					}
				},
				{ $sort: { created_at: -1 } },
				{ $skip: skip },
				{ $limit: pageSize }
			])
		}

		// Get total count for pagination
		const totalItems = await this.pinModel.countDocuments(
			recommendedPins.length === 0
				? {
						user_id: { $ne: userId },
						secret: false
				  }
				: {
						_id: { $nin: excludePinIds },
						user_id: { $ne: userId },
						secret: false,
						tags: { $in: recentTags }
				  }
		)

		const result = {
			data: recommendedPins,
			totalPages: Math.ceil(totalItems / pageSize)
		}

		// Cache recommendations 
		await this.cacheManager.set(cacheKey, result)

		return result
	}
}
