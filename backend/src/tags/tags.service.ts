import { GenericService } from '@/common/generic/generic.service'
import { FilterTagDto } from '@/tags/dto/filter-tag-dto'
import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateTagDto } from './dto/create-tag.dto'
import { Tag, TagDocument } from './tag.schema'

@Injectable()
export class TagsService extends GenericService<TagDocument> {
	constructor(@InjectModel(Tag.name) private readonly tagModel: Model<TagDocument>) {
		super(tagModel)
	}

	async create(createTagDto: CreateTagDto) {
		if (await this.tagModel.findOne({ name: createTagDto.name })) {
			throw new BadRequestException('Tag name already exists')
		}
		return await this.tagModel.create(createTagDto)
	}

	async findAll(filter: FilterTagDto) {
		const { page, pageSize } = filter
		let query = {}
		if (filter.name) {
			query = { name: { $regex: `^${filter.name}` } }
		}

        const tags = await this.baseFindAll({ page, pageSize }, query)
        const total = await this.tagModel.countDocuments(query)

		return {
            tags,
            totalPages: Math.ceil(total / pageSize)
        }
	}

	async remove(id: string) {
		await this.baseFindOne(id)

		await this.tagModel.deleteOne({ _id: id })

		return { message: 'Tag deleted successfully' }
	}
}
