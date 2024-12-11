import { Collection, CollectionDocument } from '@/collections/collection.schema'
import { CreateCollectionDto } from '@/collections/dto/create-collection.dto'
import { UpdateCollectionDto } from '@/collections/dto/update-collection.dto'
import { clerkClient } from '@clerk/express'
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

@Injectable()
export class CollectionsService {
	constructor(@InjectModel(Collection.name) private readonly collectionModel: Model<CollectionDocument>) {}

	async create(userId: string, createCollectionDto: CreateCollectionDto): Promise<CollectionDocument> {
		const { coverImage, ...rest } = createCollectionDto
		const data = {
			...rest,
			coverImages: coverImage ? [coverImage] : []
		}
		return this.collectionModel.create({ ...data, user_id: userId })
	}

	async update(id: string, userId: string, updateCollectionDto: UpdateCollectionDto): Promise<CollectionDocument> {
		const { coverImage, ...rest } = updateCollectionDto
		const collection = await this.collectionModel.findById(id)

		if (collection.user_id !== userId) {
			// cannot not update other user's collection
			throw new ForbiddenException("Cannot update other user's collection")
		}

		if (!collection) {
			throw new NotFoundException('Collection not found')
		}

		// if coverImage exists then swap coverImage to the first position of coverImages
		const coverImages = collection.coverImages
		if (coverImage) {
			if (coverImages.includes(coverImage)) {
				coverImages.splice(coverImages.indexOf(coverImage), 1)
				coverImages.unshift(coverImage)
			} else {
				coverImages.splice(0, 0, coverImage)
			}
		}

		const data = {
			...rest,
			coverImages
		}

		return this.collectionModel.findOneAndUpdate({ _id: id }, data, { new: true })
	}

	async delete(id: string, userId: string): Promise<void> {
		const collection = await this.collectionModel.findById(id)

		// cannot not update other user's collection
		if (collection.user_id !== userId) {
			throw new ForbiddenException("Cannot delete other user's collection")
		}

		if (!collection) {
			throw new NotFoundException('Collection not found')
		}

		await this.collectionModel.findByIdAndDelete(id)
	}

	async findAllByUserId(loginedUserId: string, userId: string): Promise<CollectionDocument[]> {
		let collections = []

		// if user is the owner of the collection then return all collections, otherwise return only public collections
		if (loginedUserId === userId) {
			collections = await this.collectionModel.find({ user_id: userId })
		} else {
			collections = await this.collectionModel.find({ user_id: userId, secret: false })
		}

		return collections
	}
}
