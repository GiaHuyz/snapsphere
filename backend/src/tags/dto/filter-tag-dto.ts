import { BaseFilterDto } from '@/common/dto/filter-base.dto'
import { Transform } from 'class-transformer'
import { IsOptional, IsString } from 'class-validator'

export class FilterTagDto extends BaseFilterDto {
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value.trim().toLowerCase())
	name?: string
}
