import { Board, BoardDocument } from '@/boards/board.schema'
import { CreateBoardDto } from '@/boards/dto/create-board.dto'
import { GenericService } from '@/common/generic/generic.service'
import { PinsService } from '@/pins/pins.service'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import mongoose, { Model, mongo } from 'mongoose'

@Injectable()
export class BoardsService extends GenericService<BoardDocument> {
	constructor(
		@InjectModel(Board.name) private readonly boardModel: Model<BoardDocument>,
		private readonly pinService: PinsService
	) {
		super(boardModel)
	}

	async findAll(query: any): Promise<BoardDocument[]> {
		return super.baseFindAll(query);
	}

	async create(userId: string, createBoardDto: CreateBoardDto): Promise<BoardDocument> {
		// check if coverImageId exists
		const { coverImageIds } = createBoardDto;
		if (coverImageIds.length > 0) {
			for (const coverImageId of coverImageIds) {
				await this.pinService.baseFindOne(coverImageId.toString());
			}
		}

		return this.boardModel.create({ ...createBoardDto, user_id: userId })
	}

	
	// async update(id: string, userId: string, updateBoardDto: UpdateBoardDto): Promise<BoardDocument> {
	// 	const { coverImageId, ...rest } = updateBoardDto
	// 	const board = await this.boardModel.findById(id)

	// 	if (!board) {
	// 		throw new NotFoundException('Board not found')
	// 	}

	// 	if (board.user_id !== userId) {
	// 		throw new ForbiddenException("Cannot update other user's board")
	// 	}

	// 	if (rest.title) {
	// 		const existsBoard = await this.boardModel.findOne({
	// 			_id: { $ne: board._id },
	// 			title: { $regex: new RegExp(`^${rest.title}$`, 'i') }
	// 		})
	// 		if (existsBoard) {
	// 			throw new BadRequestException('Title already exists')
	// 		}
	// 	}

	// 	const coverImages = board.coverImages
	// 	if (coverImageId && coverImageId !== coverImages[0].pin_id) {
	// 		const pin = await this.pinModel.findById(coverImageId).select('url')
	// 		if (!pin) {
	// 			throw new BadRequestException('Cover image not found')
	// 		}
	// 		if (coverImages.includes({ pin_id: coverImageId, url: pin.url })) {
	// 			coverImages.splice(coverImages.indexOf({ pin_id: coverImageId, url: pin.url }), 1)
	// 			coverImages.unshift({ pin_id: coverImageId, url: pin.url })
	// 		}
	// 	}

	// 	const data = {
	// 		...rest,
	// 		coverImages
	// 	}

	// 	return this.boardModel.findOneAndUpdate({ _id: id }, data, { new: true })
	// }

	// async delete(id: string, userId: string): Promise<void> {
	// 	const board = await this.boardModel.findById(id)

	// 	// cannot not update other user's board
	// 	if (board.user_id !== userId) {
	// 		throw new ForbiddenException("Cannot delete other user's board")
	// 	}

	// 	if (!board) {
	// 		throw new NotFoundException('Board not found')
	// 	}

	// 	await this.boardModel.findByIdAndDelete(id)
	// }

	// async findAllByUserId(loginedUserId: string, userId: string): Promise<BoardDocument[]> {
	// 	if (loginedUserId !== userId) {
	// 		return this.boardModel.find({ user_id: userId, secret: false })
	// 	}

	// 	return await this.boardModel.find({ user_id: userId })
	// }
}
