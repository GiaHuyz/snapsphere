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

	async delete(id: string, userId: string): Promise<void> {
		// check if board exists
		const board = await this.baseFindOne(id);

		// check ownership
		checkOwnership(board, userId);

		// delete board
		// TODO: delete all pins in this board or not?
		await this.boardModel.findByIdAndDelete(id)
	}

	private async checkPinsCoverExist(coverImageIds: Array<mongoose.Types.ObjectId>): Promise<void> {
		for (const coverImageId of coverImageIds) {
			await this.pinService.baseFindOne(coverImageId.toString());
		}
	}
}
