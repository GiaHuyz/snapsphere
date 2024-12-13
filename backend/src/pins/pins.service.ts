import { BoardPin, BoardPinDocument } from '@/board-pin/board-pin.schema'
import { Board, BoardDocument } from '@/boards/board.schema'
import { SavePinDto } from '@/pins/dto/save-pin.dto'
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CloudinaryService } from '../cloudinary/cloudinary.service'
import { CreatePinDto } from './dto/create-pin.dto'
import { Pin, PinDocument } from './pin.schema'

@Injectable()
export class PinsService {
	constructor(
		@InjectModel(Pin.name) private readonly pinModel: Model<PinDocument>,
		@InjectModel(Board.name) private readonly boardModel: Model<BoardDocument>,
		@InjectModel(BoardPin.name) private readonly boardPinModel: Model<BoardPinDocument>,
		private readonly cloudinaryService: CloudinaryService
	) {}

	async findAllPinsByUserId(userId: string): Promise<PinDocument[]> {
		return this.pinModel.find({ user_id: userId }).sort({ createdAt: -1 })
	}

	async create(userId: string, createPinDto: CreatePinDto, image: Express.Multer.File): Promise<PinDocument> {
		// Upload image to Cloudinary
		const uploadedImage = await this.cloudinaryService.uploadFile(image, userId)

		const { board_id, ...rest } = createPinDto
		const board = await this.boardModel.findById(board_id)

		if (!board) {
			throw new NotFoundException('Board not found')
		}

		// Create new pin with uploaded image URL
		const newPin = await this.pinModel.create({
			...rest,
			url: uploadedImage.secure_url,
			user_id: userId
		})

		board.pinCount += 1

		if (board.coverImages.length < 3) {
			board.coverImages.push({ pin_id: newPin._id, url: uploadedImage.secure_url })
		}

		await Promise.all([this.boardPinModel.create({ board_id, pin_id: newPin._id, user_id: userId }), board.save()])

		return newPin
	}

	async savePinToBoard(userId: string, savePinDto: SavePinDto): Promise<{ message: string }> {
		const { pinId, boardId } = savePinDto

		const [pin, board] = await Promise.all([this.pinModel.findById(pinId), this.boardModel.findOne(boardId)])

		if (!pin || !board) {
			throw new NotFoundException('Pin or board not found')
		}

		const boardPin = await this.boardPinModel.findOne({ board_id: boardId, pin_id: pinId })

		if (boardPin) {
			throw new BadRequestException('Pin already saved to board')
		}

		board.pinCount += 1
		if (board.coverImages.length < 3) {
			board.coverImages.push({ pin_id: pinId, url: pin.url })
		}

		await Promise.all([
			this.boardPinModel.create({ board_id: boardId, pin_id: pinId, user_id: userId }),
			board.save(),
			this.pinModel.updateOne({ _id: pinId }, { $inc: { saveCount: 1 } })
		])

		return { message: 'Pin saved successfully' }
	}

	async deleteFromBoard(pinId: string, userId: string, boardId: string): Promise<{ message: string }> {
		const boardPin = await this.boardPinModel.findOne({ pin_id: pinId, board_id: boardId })

		if (!boardPin) {
			throw new NotFoundException('Pin not found')
		}

		if (boardPin.user_id !== userId) {
			throw new UnauthorizedException('You do not have permission to delete this pin.')
		}

		await Promise.all([
			this.boardPinModel.deleteOne({ pin_id: pinId, board_id: boardId }),
			this.boardModel.updateOne(
				{ _id: boardId },
				{ $inc: { pinCount: -1 } },
				{ $pull: { coverImages: { pin_id: pinId } } }
			),
			this.pinModel.updateOne({ _id: pinId }, { $inc: { saveCount: -1 } })
		])

		return { message: 'Pin has been removed from the board successfully.' }
	}

	async deletePin(pinId: string, userId: string): Promise<{ message: string }> {
		const pin = await this.pinModel.findById(pinId)

		if (!pin) {
			throw new NotFoundException('Pin not found')
		}

		if (pin.user_id !== userId) {
			throw new UnauthorizedException('You do not have permission to delete this pin.')
		}

		const boardIds = await this.boardPinModel.find({ pin_id: pinId }).distinct('board_id')
        
		await Promise.all([
            this.cloudinaryService.deleteFile(pin.url),
			this.pinModel.deleteOne({ _id: pinId }),
			this.boardPinModel.deleteMany({ pin_id: pinId }),
			this.boardModel.updateMany({ _id: { $in: boardIds } }, { $inc: { pinCount: -1 } }),
			this.boardModel.updateMany({ 'coverImages.pin_id': pinId }, { $pull: { coverImages: { pin_id: pinId } } })
		])

		return { message: 'Pin has been deleted successfully' }
	}
}
