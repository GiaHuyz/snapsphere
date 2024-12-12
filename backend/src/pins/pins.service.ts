import { BoardPin, BoardPinDocument } from '@/board-pin/board-pin.schema'
import { Board, BoardDocument } from '@/boards/board.schema'
import { SavePinDto } from '@/pins/dto/save-pin.dto'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
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

		// Create new pin with uploaded image URL
		const newPin = await this.pinModel.create({
			...rest,
			url: uploadedImage.secure_url,
			user_id: userId
		})
		await this.boardPinModel.create({ board_id, pin_id: newPin._id, user_id: userId })

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

		await Promise.all([
			this.boardPinModel.create({ board_id: boardId, pin_id: pinId, user_id: userId }),
			this.pinModel.updateOne({ _id: pinId }, { $inc: { saveCount: 1 } })
		])

		return { message: 'Pin saved successfully' }
	}

    async delete(id: string, userId: string): Promise<{ message: string }> {
        const pin = await this.pinModel.findById(id)

        if (!pin) {
            throw new NotFoundException('Pin not found')
        }

        if (pin.user_id !== userId) {
            await this.boardPinModel.deleteMany({ pin_id: id, user_id: userId })
        }

        await Promise.all([
            this.pinModel.deleteOne({ _id: id }),
            this.boardPinModel.deleteMany({ pin_id: id })
        ])

        return { message: 'Pin deleted successfully' }
    }
}
