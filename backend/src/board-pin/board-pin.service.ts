import { BoardPin, BoardPinDocument } from '@/board-pin/board-pin.schema'
import { CreateBoardPinDto } from '@/board-pin/dto/create-board-pin.dto'
import { BoardsService } from '@/boards/boards.service'
import { GenericService } from '@/common/generic/generic.service'
import { checkOwnership } from '@/common/utils/check-owner-ship.util'
import { PinsService } from '@/pins/pins.service'
import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { FilterBoardPinDto } from './dto/filter-board-pin.dto'

@Injectable()
export class BoardPinService extends GenericService<BoardPinDocument> {
	constructor(
		@InjectModel(BoardPin.name) private readonly boardPinModel: Model<BoardPinDocument>,
		@Inject(forwardRef(() => BoardsService)) private readonly boardService: BoardsService,
		@Inject(forwardRef(() => PinsService)) private readonly pinService: PinsService
	) {
		super(boardPinModel)
	}

	async findAll(query: FilterBoardPinDto, userId?: string): Promise<BoardPinDocument[]> {
		// extract query parameters
		const { user_id, board_id, pin_id, page = 1, pageSize = 10 } = query
		// build filter conditions
		const filterConditions: any = {}

		if (user_id) filterConditions.user_id = user_id
		if (board_id) filterConditions.board_id = board_id
		if (pin_id) filterConditions.pin_id = pin_id

		for (const [key, value] of Object.entries(filterConditions)) {
			// convert ObjectId to string
			if (key === 'board_id' || key === 'pin_id') {
				filterConditions[key] = Types.ObjectId.createFromHexString(value as string)
			}
		}

		const boardsPin = await this.boardPinModel.aggregate([
			{ $match: filterConditions },
			{
				$lookup: {
					from: 'boards',
					localField: 'board_id',
					foreignField: '_id',
					as: 'board'
				}
			},
			{ $unwind: '$board' },
			{
				$lookup: {
					from: 'pins',
					localField: 'pin_id',
					foreignField: '_id',
					as: 'pin'
				}
			},
			{ $unwind: '$pin' },
			{
				$project: {
                    _id: 1,
					user_id: 1,
					board: {
                        $cond: {
                            if: { $eq: ['$board.user_id', userId] },
                            then: '$board',
                            else: { 
                                $cond: {
                                    if: { $eq: ['$board.secret', false] },
                                    then: '$board',
                                    else: undefined
                                }
                            }
                        }
                    },
                    pin: {
                        $cond: {
                            if: { $eq: ['$pin.user_id', userId] },
                            then: '$pin',
                            else: { 
                                $cond: {
                                    if: { $eq: ['$pin.secret', false] },
                                    then: '$pin',
                                    else: undefined
                                }
                            }
                        }
                    }
				}
			},
            {
                $skip: (page - 1) * pageSize
            },
            {
                $limit: pageSize
            }
		])

		return boardsPin
	}

	async create(userId: string, createBoardPinDto: CreateBoardPinDto): Promise<BoardPinDocument> {
		// check if board exists
		const board = await this.boardService.baseFindOne(createBoardPinDto.board_id.toString())

		// check if the board belongs to the user
		if (board.user_id.toString() !== userId) {
			throw new BadRequestException(['Board does not belong to you'])
		}

		// check if pin exists
		const pin = await this.pinService.baseFindOne(createBoardPinDto.pin_id.toString())

		// check if the pin is already in the board
		const isBoardPinExists = await this.boardPinModel.exists({
			board_id: createBoardPinDto.board_id,
			pin_id: createBoardPinDto.pin_id
		})

		if (isBoardPinExists) {
			throw new BadRequestException(['Pin already in the board'])
		}

		// add pin to cover images when cover images is less than 3
		if (board.coverImages.length < 3) {
			board.coverImages.push(createBoardPinDto.pin_id)
		}

		board.pinCount = board.pinCount + 1
		pin.saveCount = pin.saveCount + 1

		const [newBoardPin] = await Promise.all([
			this.boardPinModel.create({
				user_id: userId,
				board_id: createBoardPinDto.board_id,
				pin_id: createBoardPinDto.pin_id
			}),
			board.save(),
			pin.save()
		])

		return newBoardPin
	}

	async delete(userId: string, id: string) {
		const boardPin = await this.baseFindOne(id)

		// check if the user is the owner of the board pin
		checkOwnership(boardPin, userId)

		const pin = await this.pinService.baseFindOne(boardPin.pin_id.toString())
		pin.saveCount = pin.saveCount - 1

		const board = await this.boardService.baseFindOne(boardPin.board_id)
		board.pinCount = board.pinCount - 1
        board.coverImages = board.coverImages.filter((id) => id.toString() !== boardPin.pin_id.toString())

		// delete board pin
		await Promise.all([this.boardPinModel.findByIdAndDelete(id), pin.save(), board.save()])

		return { message: 'Board pin deleted successfully' }
	}
}
