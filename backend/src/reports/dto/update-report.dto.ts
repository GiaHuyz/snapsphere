import { IsEnum, IsOptional } from 'class-validator'

enum ReportStatus {
	PENDING = 'pending',
	PROCESSED = 'processed'
}

export class UpdateReportDto {
	@IsOptional()
	@IsEnum(ReportStatus)
	status: ReportStatus
}
