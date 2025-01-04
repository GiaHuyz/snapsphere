import { CommentsService } from '@/comments/comments.service'
import { GenericService } from '@/common/generic/generic.service'
import { PinsService } from '@/pins/pins.service'
import { FilterReportDto } from '@/reports/dto/filter-report.dto'
import { clerkClient } from '@clerk/express'
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import mongoose, { isObjectIdOrHexString, Model } from 'mongoose'
import { CreateReportDto } from './dto/create-report.dto'
import { UpdateReportDto } from './dto/update-report.dto'
import { Report, ReportDocument } from './report.schema'

@Injectable()
export class ReportsService extends GenericService<ReportDocument> {
	constructor(
		@InjectModel(Report.name) private reportModel: Model<ReportDocument>,
		private readonly pinService: PinsService,
		private readonly commentsService: CommentsService
	) {
		super(reportModel)
	}

	async create(createReportDto: CreateReportDto, userId: string) {
		if (createReportDto.type === 'pin') {
			await this.pinService.baseFindOne(createReportDto.item_id)
		} else if (createReportDto.type === 'comment') {
			await this.commentsService.baseFindOne(createReportDto.item_id)
		} else {
			if (!(await clerkClient.users.getUser(createReportDto.item_id))) {
				throw new NotFoundException('User not found')
			}
		}
		const newReport = await this.reportModel.create({
			...createReportDto,
			user_id: userId,
			item_id: isObjectIdOrHexString(createReportDto.item_id)
				? mongoose.Types.ObjectId.createFromHexString(createReportDto.item_id)
				: createReportDto.item_id
		})
		return newReport
	}

	async findAll(query: FilterReportDto) {
		const { page, pageSize, ...filter } = query
		const data = await this.baseFindAll({ page, pageSize }, filter)
		const totalItems = await this.reportModel.countDocuments(filter)
		return { data, totalPages: Math.ceil(totalItems / pageSize) }
	}

	async update(id: string, updateReportDto: UpdateReportDto) {
		return this.baseUpdate(id, updateReportDto)
	}

	async remove(id: string) {
		return this.baseDelete(id)
	}
}
