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
		// extract query parameters
		const { user_id, title, description, pinCountMin, pinCountMax } = query
		// build filter conditions
		const filterConditions: any = {}

		if (user_id) filterConditions.user_id = user_id
		if (title) filterConditions.title = { $regex: title, $options: 'i' }
		if (description) filterConditions.description = { $regex: description, $options: 'i' }
		if (pinCountMin) filterConditions.pinCount = { $gte: pinCountMin }
		if (pinCountMax) filterConditions.pinCount = { $lte: pinCountMax }

		const sort: Record<string, 1 | -1> = {}
		if (['title', 'pinCount', 'createdAt'].includes(query.sort?.split('-')[0])) {
			const order = query.sort.split('-')[1]
			if (order !== 'asc' && order !== 'desc') throw new BadRequestException('Invalid order')
			sort[query.sort.split('-')[0]] = order === 'asc' ? 1 : -1
		}

		if (Object.keys(sort).length === 0) {
			sort.createdAt = -1
		}

		// only authenticated users can get their own boards
		const currentUserId = userId
		if (currentUserId !== user_id) {
			filterConditions.secret = false // only public boards can be fetched
		}

		const result = await this.baseFindAll(query, filterConditions, {
			path: 'coverImages',
			select: 'url'
		}, sort)

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

		const newBoard = await this.boardModel.create({
			...createBoardDto,
			user_id: userId,
			coverImages: coverImageIds
		})

		return newBoard
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
		const updatedBoard = await this.boardModel.findByIdAndUpdate(id, document, { new: true })

		return updatedBoard
	}

	async delete(id: string, userId: string, isAdmin?: boolean) {
		const document = await this.baseFindOne(id)

		if (!isAdmin) checkOwnership(document, userId)

		await Promise.all([
			this.boardModel.findByIdAndDelete(id),
			this.boardPinModel.deleteMany({ board_id: document._id })
		])

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
