import { Board, BoardDocument } from '@/boards/board.schema'
import { CreateBoardDto } from '@/boards/dto/create-board.dto'
import { GenericService } from '@/common/generic/generic.service'
import { checkOwnership } from '@/common/utils/check-owner-ship.util'
import { PinsService } from '@/pins/pins.service'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import mongoose, { Model, mongo } from 'mongoose'
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

		return this.boardModel.create({
			...createBoardDto,
			user_id: userId,
			coverImages: coverImageIds
		});
	}

	async update(id: string, userId: string, updateBoardDto: UpdateBoardDto): Promise<BoardDocument> {
		// check if coverImageId exists
		const { coverImageIds } = updateBoardDto;
		if (coverImageIds.length > 0) {
			this.checkPinsCoverExist(coverImageIds);
		}

		// check pin exist
		const document = await this.baseFindOne(id);
		
		// check ownership
		checkOwnership(document, userId);
		
		// update board with new data
		document.set({
			...updateBoardDto,
			coverImages: coverImageIds
		})
		// save and return updated board
		return this.boardModel.findByIdAndUpdate(id, document, { new: true });
	}

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

	private async checkPinsCoverExist(coverImageIds: Array<mongoose.Types.ObjectId>): Promise<void> {
		for (const coverImageId of coverImageIds) {
			await this.pinService.baseFindOne(coverImageId.toString());
		}
	}
}
