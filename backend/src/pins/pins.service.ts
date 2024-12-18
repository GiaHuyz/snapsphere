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

@Injectable()
export class PinsService extends GenericService<PinDocument> {
	constructor(
		@InjectModel(Pin.name) private readonly pinModel: Model<PinDocument>,
		@InjectModel(Board.name) private readonly boardModel: Model<BoardDocument>,
		private readonly cloudinaryService: CloudinaryService
	) {
		super(pinModel)
	}

	async findAll(query: any): Promise<PinDocument[]> {
		const filterKey = ['title', 'user_id']
		const filter = {}

		for (const key of filterKey) {
			if (query[key]) { 
				if (key === 'title') {
					query[key] = { $regex: query[key], $options: 'i' }
				}
				filter[key] = query[key]
			}
		}

		return this.baseFindAll(query, filter)
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
		// Upload image to Cloudinary
		const uploadedImage = await this.cloudinaryService.uploadFile(image, userId)

		// save pin to database
		const newPin = await this.pinModel.create({
			...createPinDto,
			url: uploadedImage.secure_url, // image url
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

		await Promise.all([
			// delete the image from Cloudinary
			this.cloudinaryService.deleteFile(pin.url),
			// remove cover image from all boards
			this.boardModel.updateMany({ coverImages: pin._id }, { $pull: { coverImages: pin._id } }),
			// delete the pin from the database
			this.pinModel.findByIdAndDelete(id)
		])
	}
}
