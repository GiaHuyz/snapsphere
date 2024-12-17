import { BaseFilterDto } from '@/common/dto/filter-base.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsMongoId } from 'class-validator';

export class FilterBoardPinDto extends BaseFilterDto {
  @ApiPropertyOptional({
    description: 'Filter by the user ID who owns the board pin',
  })
  @IsOptional()
  user_id?: string;

  @ApiPropertyOptional({
    description: 'Filter by the board ID to which the pin belongs',
  })
  @IsOptional()
  @IsMongoId()
  board_id?: string;

  @ApiPropertyOptional({
    description: 'Filter by the pin ID in the board',
  })
  @IsOptional()
  @IsMongoId()
  pin_id?: string;
}
