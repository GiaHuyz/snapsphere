import { BaseFilterDto } from "@/common/dto/filter-base.dto"
import { IsOptional, IsString } from "class-validator"

export class FilterReportDto extends BaseFilterDto {
    @IsOptional()
    @IsString()
    reason?: string

    @IsOptional()
    @IsString()
	type?: string

    @IsOptional()
    @IsString()
	status?: string
}
