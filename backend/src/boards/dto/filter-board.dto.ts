// boards/dto/filter-board.dto.ts
import { BaseFilterDto } from '@/common/dto/filter-base.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsMongoId, IsBoolean, IsString, MaxLength } from 'class-validator';

export class FilterBoardDto extends BaseFilterDto {
  @ApiPropertyOptional({
    description: 'Filter by the user ID who owns the board',
  })
  @IsOptional()
  user_id?: string;

  @ApiPropertyOptional({
    description: 'Filter by the title of the board',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  title?: string;

  @ApiPropertyOptional({
    description: 'Filter by the description of the board',
  })
  @IsOptional()
  @IsString()
  @MaxLength(160)
  description?: string;

  @ApiPropertyOptional({
    description: 'Filter by whether the board is secret or public',
  })
  @IsOptional()
  @IsBoolean()
  secret?: boolean;

  @ApiPropertyOptional({
    description: 'Filter by the minimum number of pins in the board',
  })
  @IsOptional()
  pinCountMin?: number;

  @ApiPropertyOptional({
    description: 'Filter by the maximum number of pins in the board',
  })
  @IsOptional()
  pinCountMax?: number;
}
