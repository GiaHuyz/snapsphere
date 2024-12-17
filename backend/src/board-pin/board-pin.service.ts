import { BoardPin, BoardPinDocument } from '@/board-pin/board-pin.schema'
import { CreateBoardPinDto } from '@/board-pin/dto/create-board-pin.dto'
import { BoardsService } from '@/boards/boards.service'
import { GenericService } from '@/common/generic/generic.service'
import { PinsService } from '@/pins/pins.service'
import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

@Injectable()
export class BoardPinService extends GenericService<BoardPinDocument> {
	constructor(
		@InjectModel(BoardPin.name) private readonly boardPinModel: Model<BoardPinDocument>,
		private readonly boardService: BoardsService,
		private readonly pinService: PinsService
	) {
		super(boardPinModel)
	}

	async create(userId: string, createBoardPinDto: CreateBoardPinDto) {
		// check if board exists
		const board = await this.boardService.baseFindOne(createBoardPinDto.board_id.toString())

		// check if pin exists
		const pin = await this.pinService.baseFindOne(createBoardPinDto.pin_id.toString())

		// check if the pin is already in the board
		if (
			await this.boardPinModel.findOne({ board_id: createBoardPinDto.board_id, pin_id: createBoardPinDto.pin_id })
		) {
			throw new BadRequestException('Pin already in the board')
		}

		const coverImageIds =
			board.coverImages.length < 3 ? [...board.coverImages, createBoardPinDto.pin_id] : board.coverImages

		await Promise.all([
			this.boardPinModel.create({
				user_id: userId,
				board_id: createBoardPinDto.board_id,
				pin_id: createBoardPinDto.pin_id
			}),
			this.boardService.baseUpdate(board._id.toString(), {
				pinCount: board.pinCount + 1,
				coverImages: coverImageIds
			}),
			this.pinService.baseUpdate(pin._id.toString(), { saveCount: pin.saveCount + 1 })
		])

		return { message: 'Pin added to board' }
	}
}
