import { CommentsModule } from '@/comments/comments.module'
import { PinsModule } from '@/pins/pins.module'
import { Report, ReportSchema } from '@/reports/report.schema'
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ReportsController } from './reports.controller'
import { ReportsService } from './reports.service'

@Module({
	imports: [MongooseModule.forFeature([{ name: Report.name, schema: ReportSchema }]), PinsModule, CommentsModule],
	controllers: [ReportsController],
	providers: [ReportsService]
})
export class ReportsModule {}
