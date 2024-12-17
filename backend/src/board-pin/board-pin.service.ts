import { BoardPin, BoardPinDocument } from '@/board-pin/board-pin.schema'
import { CreateBoardPinDto } from '@/board-pin/dto/create-board-pin.dto'
import { BoardsService } from '@/boards/boards.service'
import { GenericService } from '@/common/generic/generic.service'
import { PinsService } from '@/pins/pins.service'
import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, startSession } from 'mongoose'

@Injectable()
export class BoardPinService extends GenericService<BoardPinDocument> {
	constructor(
		@InjectModel(BoardPin.name) private readonly boardPinModel: Model<BoardPinDocument>,
		private readonly boardService: BoardsService,
		private readonly pinService: PinsService
	) {
		super(boardPinModel)
	}

	async create(userId: string, createBoardPinDto: CreateBoardPinDto): Promise<BoardPinDocument> {
		// use transaction to ensure data consistency
		const session = await startSession();
		session.startTransaction();

		try {
			// check if board exists
			const board = await this.boardService.baseFindOne(createBoardPinDto.board_id.toString())

			// check if pin exists
			const pin = await this.pinService.baseFindOne(createBoardPinDto.pin_id.toString())

			// check if the pin is already in the board
			const isBoardPinExists = await this.boardPinModel.exists({
				board_id: createBoardPinDto.board_id,
				pin_id: createBoardPinDto.pin_id
			});

			if (isBoardPinExists) {
				throw new BadRequestException(['Pin already in the board'])
			}

			// check if the board belongs to the user
			if (board.user_id.toString() !== userId) {
				throw new BadRequestException(['Board does not belong to you'])
			}

			// add pin to cover images when cover images is less than 3
			if (board.coverImages.length < 3) {
				board.coverImages.push(createBoardPinDto.pin_id)
			}

			// add pin to board and update pin count
			const createdModel = await this.boardPinModel.create([{
				user_id: userId,
				board_id: createBoardPinDto.board_id,
				pin_id: createBoardPinDto.pin_id
			}, { session }]);

			// update board pin count
			board.pinCount = board.pinCount + 1
			await board.save({ session });

			// update pin save count
			pin.saveCount = pin.saveCount + 1
			await pin.save({ session });

			// commit transaction
			await session.commitTransaction();
			return createdModel[0];

		} catch (error) {
			await session.abortTransaction();
			session.endSession();
			throw error;
		} finally {
			session.endSession();
		}

	}
}
