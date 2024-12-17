import { Board, BoardDocument } from '@/boards/board.schema'
import { CreateBoardDto } from '@/boards/dto/create-board.dto'
import { GenericService } from '@/common/generic/generic.service'
import { checkOwnership } from '@/common/utils/check-owner-ship.util'
import { PinsService } from '@/pins/pins.service'
import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import mongoose, { Model } from 'mongoose'
import { UpdateBoardDto } from './dto/update-board.dto'

@Injectable()
export class BoardsService extends GenericService<BoardDocument> {
	constructor(
		@InjectModel(Board.name) private readonly boardModel: Model<BoardDocument>,
		private readonly pinService: PinsService
	) {
		super(boardModel)
	}

	async findAll(query: any): Promise<BoardDocument[]> {
		const queryObj = {}
		const queryKeys = ['user_id']
		for (const key of queryKeys) {
			queryObj[key] = query[key]
		}
		return this.boardModel.find(queryObj).populate({
            path: 'coverImages',
            select: 'url'
        })
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

	async delete(id: string, userId: string): Promise<void> {
		// check if board exists
		const board = await this.baseFindOne(id)

		// check ownership
		checkOwnership(board, userId)

		// delete board
		// TODO: delete all pins in this board or not?
		await this.boardModel.findByIdAndDelete(id)
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
