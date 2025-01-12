import { IsNumber, IsOptional } from 'class-validator'
import { BaseFilterDto } from '@/common/dto/filter-base.dto'

export class GetRecommendedPinsDto extends BaseFilterDto {
    @IsOptional()
    @IsNumber()
    weightFollowing?: number = 0.4 // Weight for pins from followed users

    @IsOptional()
    @IsNumber()
    weightTags?: number = 0.4 // Weight for pins with similar tags

    @IsOptional()
    @IsNumber()
    weightBoards?: number = 0.2 // Weight for pins from similar boards
}
