import { BoardPin, BoardPinDocument } from '@/board-pin/board-pin.schema'
import { Board, BoardDocument } from '@/boards/board.schema'
import { GenericService } from '@/common/generic/generic.service'
import { checkOwnership } from '@/common/utils/check-owner-ship.util'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CloudinaryService } from '../cloudinary/cloudinary.service'
import { CreatePinDto } from './dto/create-pin.dto'
import { UpdatePinDto } from './dto/update-pin.dto'
import { Pin, PinDocument } from './pin.schema'
import { v2 as cloudinary } from 'cloudinary'
import { FilterPinDto } from './dto/filter-pin.dto'
import { buildRangeFilter } from '@/common/utils/build-range-filter'

@Injectable()
export class PinsService extends GenericService<PinDocument> {
	constructor(
		@InjectModel(Pin.name) private readonly pinModel: Model<PinDocument>,
		@InjectModel(Board.name) private readonly boardModel: Model<BoardDocument>,
		@InjectModel(BoardPin.name) private readonly boardPinModel: Model<BoardPinDocument>,
		private readonly cloudinaryService: CloudinaryService
	) {
		super(pinModel)
	}

	async findAll(
		query: FilterPinDto,
		userId: string): Promise<PinDocument[]> {
		// extract query parameters
		const {
			user_id,
			title,
			description,
			saveCountMin,
			saveCountMax,
			likeCountMin,
			likeCountMax,
			commentCountMin,
			commentCountMax
		} = query
		// build filter conditions
		const filter: any = {}

		if (user_id) filter.user_id = user_id
		if (title) filter.title = { $regex: title, $options: 'i' }
		if (description) filter.description = { $regex: description, $options: 'i' }

		// Add range filters only if they are valid
		const saveCountFilter = buildRangeFilter(saveCountMin, saveCountMax);
		const likeCountFilter = buildRangeFilter(likeCountMin, likeCountMax);
		const commentCountFilter = buildRangeFilter(commentCountMin, commentCountMax);

		if (saveCountFilter) filter.saveCount = saveCountFilter;
		if (likeCountFilter) filter.likeCount = likeCountFilter;
		if (commentCountFilter) filter.commentCount = commentCountFilter;

		// TODO: only owner can view their private pin
		// only authenticated users can get their own pins
		// if (userId && ) {
		// }


		return this.baseFindAll(query, filter);
	}

	/**
	 * Creates a new pin.
	 *
	 * @param userId - The ID of the user creating the pin.
	 * @param createPinDto - The data transfer object containing the details of the pin to be created.
	 * @param image - The image file to be uploaded and associated with the pin.
	 * @returns A promise that resolves to the created pin document.
	 */
	async create(userId: string, createPinDto: CreatePinDto, image: Express.Multer.File): Promise<PinDocument> {
		let uploadedImage = ''

		if (image) {
			uploadedImage = (await this.cloudinaryService.uploadFile(image, userId)).secure_url
		} else {
			uploadedImage = createPinDto.url
		}
		// Upload image to Cloudinary

		// save pin to database
		const newPin = await this.pinModel.create({
			...createPinDto,
			url: uploadedImage, // image url
			user_id: userId // owner of the pin
		})

		return newPin
	}

	/**
	 * Updates a pin with the given data.
	 *
	 * @param {string} id - The ID of the pin to update.
	 * @param {UpdatePinDto} updatedPinDto - The data to update the pin with.
	 * @param {string} userId - The ID of the user performing the update.
	 * @param {Express.Multer.File} [image] - An optional new image file to update the pin with.
	 * @returns {Promise<PinDocument>} - The updated pin document.
	 *
	 * @throws {Error} If the pin does not exist.
	 * @throws {Error} If the user is not the owner of the pin.
	 */
	async update(
		id: string,
		updatedPinDto: UpdatePinDto,
		userId: string,
		image?: Express.Multer.File
	): Promise<PinDocument> {
		// check if the pin exists
		const pin = await super.baseFindOne(id)

		// check if the user is the owner of the pin
		checkOwnership(pin, userId)

		// if the user wants to update the image
		if (image) {
			// delete the old image from Cloudinary
			await this.cloudinaryService.deleteFile(pin.url)

			// upload the new image to Cloudinary
			const uploadedImage = await this.cloudinaryService.uploadFile(image, userId)

			// update the pin with the new image
			pin.url = uploadedImage.secure_url
		}

		// update the pin with the new data
		pin.set(updatedPinDto)
		return await pin.save()
	}

	async delete(id: string, userId: string): Promise<void> {
		// check if the pin exists
		const pin = await super.baseFindOne(id)

		// check if the user is the owner of the pin
		checkOwnership(pin, userId)

		const boardIds = await this.boardPinModel.find({ pin_id: pin._id }).distinct('board_id')

		await Promise.all([
			// delete the image from Cloudinary
			this.cloudinaryService.deleteFile(pin.url),
			// remove cover image from all boards
			this.boardModel.updateMany({ coverImages: pin._id }, { $pull: { coverImages: pin._id } }),
			this.boardModel.updateMany({ _id: { $in: boardIds } }, { $inc: { pinCount: -1 } }),
			// delete the pin from the database
			this.pinModel.findByIdAndDelete(id),
			this.boardPinModel.deleteMany({ pin_id: pin._id })
		])
	}
}
