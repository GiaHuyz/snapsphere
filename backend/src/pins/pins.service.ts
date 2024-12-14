import { BoardPin, BoardPinDocument } from '@/board-pin/board-pin.schema'
import { Board, BoardDocument } from '@/boards/board.schema'
import { SavePinDto } from '@/pins/dto/save-pin.dto'
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CloudinaryService } from '../cloudinary/cloudinary.service'
import { CreatePinDto } from './dto/create-pin.dto'
import { Pin, PinDocument } from './pin.schema'
import { GenericService } from '@/common/generic/generic.service'

@Injectable()
export class PinsService extends GenericService<PinDocument> {
	constructor(
		@InjectModel(Pin.name) private readonly pinModel: Model<PinDocument>,
		private readonly cloudinaryService: CloudinaryService
	) {
		super(pinModel);
	}

	
	/**
	 * Creates a new pin.
	 * 
	 * @param userId - The ID of the user creating the pin.
	 * @param createPinDto - The data transfer object containing the details of the pin to be created.
	 * @param image - The image file to be uploaded and associated with the pin.
	 * @returns A promise that resolves to the created pin document.
	 */
	async create(
		userId: string,
		createPinDto: CreatePinDto,
		image: Express.Multer.File): Promise<PinDocument> {
		// Upload image to Cloudinary
		const uploadedImage = await this.cloudinaryService.uploadFile(image, userId);

		// save pin to database	
		const newPin = await this.pinModel.create({
			...createPinDto,
			url: uploadedImage.secure_url, // image url
			user_id: userId // owner of the pin
		});

		return newPin;
	}
}
