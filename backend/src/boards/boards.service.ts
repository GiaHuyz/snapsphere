import { BoardPin, BoardPinDocument } from '@/board-pin/board-pin.schema'
import { Board, BoardDocument } from '@/boards/board.schema'
import { CreateBoardDto } from '@/boards/dto/create-board.dto'
import { GenericService } from '@/common/generic/generic.service'
import { checkOwnership } from '@/common/utils/check-owner-ship.util'
import { PinsService } from '@/pins/pins.service'
import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import mongoose, { Model } from 'mongoose'
import { FilterBoardDto } from './dto/filter-board.dto'
import { UpdateBoardDto } from './dto/update-board.dto'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'

@Injectable()
export class BoardsService extends GenericService<BoardDocument> {
	constructor(
		@InjectModel(Board.name) private readonly boardModel: Model<BoardDocument>,
		@InjectModel(BoardPin.name) private readonly boardPinModel: Model<BoardPinDocument>,
		private readonly pinService: PinsService,
		@Inject(CACHE_MANAGER) private cacheManager: Cache
	) {
		super(boardModel)
	}

	async findAll(query: FilterBoardDto, userId?: string): Promise<BoardDocument[]> {
		const cacheKey = `boards:${JSON.stringify(query || {})}:${userId || 'guest'}`

		// Try to get data from cache
		const cachedData = await this.cacheManager.get(cacheKey)
		if (cachedData) return cachedData as BoardDocument[]

		// extract query parameters
		const { user_id, title, description, pinCountMin, pinCountMax } = query
		// build filter conditions
		const filterConditions: any = {}

		if (user_id) filterConditions.user_id = user_id
		if (title) filterConditions.title = { $regex: title, $options: 'i' }
		if (description) filterConditions.description = { $regex: description, $options: 'i' }
		if (pinCountMin) filterConditions.pinCount = { $gte: pinCountMin }
		if (pinCountMax) filterConditions.pinCount = { $lte: pinCountMax }

		// only authenticated users can get their own boards
		const currentUserId = userId
		if (currentUserId !== user_id) {
			filterConditions.secret = false // only public boards can be fetched
		}

		const result = await this.baseFindAll(query, filterConditions, {
			path: 'coverImages',
			select: 'url'
		})

		// Store in cache for 30 minutes
		await this.cacheManager.set(cacheKey, result)

		return result
	}

	async create(userId: string, createBoardDto: CreateBoardDto): Promise<BoardDocument> {
		// check if coverImageId exists
		const { coverImageIds } = createBoardDto
		if (coverImageIds?.length > 0) {
			for (const coverImageId of coverImageIds) {
				await this.pinService.baseFindOne(coverImageId.toString())
			}
		}

		await this.checkExistTitle(userId, createBoardDto.title)

		return this.boardModel.create({
			...createBoardDto,
			user_id: userId,
			coverImages: coverImageIds
		})
	}

	async update(id: string, userId: string, updateBoardDto: UpdateBoardDto): Promise<BoardDocument> {
		// check if coverImageId exists
		const { coverImageIds } = updateBoardDto
		if (coverImageIds?.length > 0) {
			this.checkPinsCoverExist(coverImageIds)
		}

		// check pin exist
		const document = await this.baseFindOne(id)

		// check ownership
		checkOwnership(document, userId)

		// check exist title
		await this.checkExistTitle(userId, updateBoardDto.title)

		// update board with new data
		document.set({
			...updateBoardDto,
			coverImages: coverImageIds
		})
		// save and return updated board
		return this.boardModel.findByIdAndUpdate(id, document, { new: true })
	}

	async delete(id: string, userId: string) {
		// check if board exists
		const board = await this.baseFindOne(id)

		// check ownership
		checkOwnership(board, userId)

		// delete board
		await Promise.all([this.boardModel.deleteOne({ _id: id }), this.boardPinModel.deleteMany({ board_id: id })])

		return { message: 'Board deleted successfully' }
	}

	private async checkPinsCoverExist(coverImageIds: Array<mongoose.Types.ObjectId>): Promise<void> {
		for (const coverImageId of coverImageIds) {
			await this.pinService.baseFindOne(coverImageId.toString())
		}
	}

	private async checkExistTitle(userId: string, title: string): Promise<void> {
		if (
			await this.boardModel.findOne({
				user_id: userId,
				title: { $regex: `^${title}$`, $options: 'i' }
			})
		) {
			throw new BadRequestException('Board title already exists')
		}
	}
}
