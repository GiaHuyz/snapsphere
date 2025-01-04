import { BaseFilterDto } from '@/common/dto/filter-base.dto'
import { Transform } from 'class-transformer'
import { IsMongoId, IsOptional, ValidateIf } from 'class-validator'

export class FilterCommentDto extends BaseFilterDto {
	@IsOptional()
	@IsMongoId()
	pin_id?: string
	
	@Transform(({ value }) => (value === 'null' ? null : value))
    @IsOptional()
    @IsMongoId()
	parent_id?: string | null
}
