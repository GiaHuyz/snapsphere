import { IsEnum, IsOptional } from 'class-validator'

enum ReportStatus {
	PENDING = 'pending',
	APPROVED = 'approved',
	REJECTED = 'rejected'
}

export class UpdateReportDto {
	@IsOptional()
	@IsEnum(ReportStatus)
	status: ReportStatus
}
