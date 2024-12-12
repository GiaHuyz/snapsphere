import { Board, BoardDocument } from '@/boards/board.schema'
import { CreateBoardDto } from '@/boards/dto/create-board.dto'
import { UpdateBoardDto } from '@/boards/dto/update-board.dto'
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, PipelineStage } from 'mongoose'

@Injectable()
export class BoardsService {
	constructor(@InjectModel(Board.name) private readonly boardModel: Model<BoardDocument>) {}

	async create(userId: string, createBoardDto: CreateBoardDto): Promise<BoardDocument> {
		const { coverImage, ...rest } = createBoardDto

		const existsBoard = await this.boardModel.findOne({
			user_id: userId,
			title: { $regex: new RegExp(`^${rest.title}$`, 'i') }
		})

		if (existsBoard) {
			throw new BadRequestException('Title already exists')
		}

		const data = {
			...rest,
			coverImages: coverImage ? [coverImage] : []
		}
		return this.boardModel.create({ ...data, user_id: userId })
	}

	async update(id: string, userId: string, updateBoardDto: UpdateBoardDto): Promise<BoardDocument> {
		const { coverImage, ...rest } = updateBoardDto
		const board = await this.boardModel.findById(id)

		if (!board) {
			throw new NotFoundException('Board not found')
		}

		if (board.user_id !== userId) {
			throw new ForbiddenException("Cannot update other user's board")
		}

		if (rest.title) {
			const existsBoard = await this.boardModel.findOne({
				_id: { $ne: board._id },
				title: { $regex: new RegExp(`^${rest.title}$`, 'i') }
			})
			if (existsBoard) {
				throw new BadRequestException('Title already exists')
			}
		}

		// if coverImage exists then swap coverImage to the first position of coverImages
		const coverImages = board.coverImages
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

		return this.boardModel.findOneAndUpdate({ _id: id }, data, { new: true })
	}

	async delete(id: string, userId: string): Promise<void> {
		const board = await this.boardModel.findById(id)

		// cannot not update other user's board
		if (board.user_id !== userId) {
			throw new ForbiddenException("Cannot delete other user's board")
		}

		if (!board) {
			throw new NotFoundException('Board not found')
		}

		await this.boardModel.findByIdAndDelete(id)
	}

	async findAllByUserId(loginedUserId: string, userId: string): Promise<BoardDocument[]> {
		const aggregatePipeline: PipelineStage[] = [
			{ $match: { user_id: userId } },
			{
				$lookup: {
					from: 'boardpins',
					localField: '_id',
					foreignField: 'board_id',
					as: 'boardpins'
				}
			},
			{ $addFields: { pinCount: { $size: '$boardpins' } } },
			{
				$project: {
					_id: 1,
					user_id: 1,
					title: 1,
					description: 1,
					pinCount: 1,
					secret: 1,
					coverImages: 1,
					createdAt: 1
				}
			}
		]

        if(loginedUserId !== userId) {
            aggregatePipeline.push({ $match: { secret: false } })
        }

		return await this.boardModel.aggregate(aggregatePipeline)
	}
}
