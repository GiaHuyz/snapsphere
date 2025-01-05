import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { CreateReportDto } from './dto/create-report.dto'
import { UpdateReportDto } from './dto/update-report.dto'
import { ReportsService } from './reports.service'
import { UserId } from '@/common/decorators/userId'
import { FilterReportDto } from '@/reports/dto/filter-report.dto'
import { AdminGuard } from '@/common/guard/admin.guard'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiTags('reports')
@ApiBearerAuth()
@Controller('reports')
export class ReportsController {
	constructor(private readonly reportsService: ReportsService) { }

	@ApiOperation({ summary: 'Create report' })
	@Post()
	create(@Body() createReportDto: CreateReportDto, @UserId() userId: string) {
		return this.reportsService.create(createReportDto, userId)
	}

	@ApiOperation({ summary: 'Get all reports only for admin' })
	@UseGuards(AdminGuard)
	@Get()
	findAll(@Query() query: FilterReportDto) {
		return this.reportsService.findAll(query)
	}

	@ApiOperation({ summary: 'Approve report only for admin' })
	@UseGuards(AdminGuard)
	@Patch(':id')
	update(@Param('id') id: string, @Body() updateReportDto: UpdateReportDto) {
		return this.reportsService.update(id, updateReportDto)
	}

	@ApiOperation({ summary: 'Delete report only for admin' })
	@UseGuards(AdminGuard)
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.reportsService.remove(id)
	}
}
