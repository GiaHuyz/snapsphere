import { BoardPin, BoardPinDocument } from '@/board-pin/board-pin.schema'
import { CreateBoardPinDto } from '@/board-pin/dto/create-board-pin.dto'
import { BoardsService } from '@/boards/boards.service'
import { GenericService } from '@/common/generic/generic.service'
import { Pin, PinDocument } from '@/pins/pin.schema'
import { PinsService } from '@/pins/pins.service'
import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, startSession } from 'mongoose'
import { FilterBoardPinDto } from './dto/filter-board-pin.dto'

@Injectable()
export class BoardPinService extends GenericService<BoardPinDocument> {
	constructor(
		@InjectModel(BoardPin.name) private readonly boardPinModel: Model<BoardPinDocument>,
		@InjectModel(Pin.name) private readonly pinModel: Model<PinDocument>,
		private readonly boardService: BoardsService,
		private readonly pinService: PinsService
	) {
		super(boardPinModel)
	}

	async findAll(query: FilterBoardPinDto): Promise<BoardPinDocument[]> {
		// extract query parameters
		const { user_id, board_id, pin_id } = query;
		// build filter conditions
		const filterConditions: any = {};

		if (user_id) filterConditions.user_id = user_id;
		if (board_id) filterConditions.board_id = board_id;
		if (pin_id) filterConditions.pin_id = pin_id;
	
		return await this.baseFindAll(query, filterConditions);
	}


	async create(userId: string, createBoardPinDto: CreateBoardPinDto): Promise < BoardPinDocument > {
	// TODO: Tìm các thêm transaction vào hàm này

	// check if board exists
	const board = await this.boardService.baseFindOne(createBoardPinDto.board_id.toString())

		// check if the board belongs to the user
		if(board.user_id.toString() !== userId) {
	throw new BadRequestException(['Board does not belong to you'])
}

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

// use transaction to ensure data consistency
// const session = await startSession();
// session.startTransaction();

try {
	// add pin to cover images when cover images is less than 3
	if (board.coverImages.length < 3) {
		board.coverImages.push(createBoardPinDto.pin_id)
	}

	// add pin to board and update pin count
	// const newBoardPin = await this.boardPinModel.create([{
	// 	user_id: userId,
	// 	board_id: createBoardPinDto.board_id,
	// 	pin_id: createBoardPinDto.pin_id
	// }, { session }]);

	const newBoardPin = await this.boardPinModel.create({
		user_id: userId,
		board_id: createBoardPinDto.board_id,
		pin_id: createBoardPinDto.pin_id
	});

	// update board pin count
	// board.pinCount = board.pinCount + 1
	// await board.save({ session });

	// update board pin count
	board.pinCount = board.pinCount + 1
	await board.save();

	// update pin save count
	// pin.saveCount = pin.saveCount + 1
	// await pin.save({ session });
	pin.saveCount = pin.saveCount + 1
	await pin.save();

	// commit transaction
	// await session.commitTransaction();
	// session.endSession(); // Đừng để quên dòng này
	return newBoardPin;
} catch (error) {
	// await session.abortTransaction();
	// session.endSession();
	throw error;
}
	}
}
