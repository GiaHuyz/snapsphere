import { BaseFilterDto } from '@/common/dto/filter-base.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsMongoId, IsString, MaxLength, IsBoolean, IsUrl, IsInt, Min } from 'class-validator';

export class FilterPinDto extends BaseFilterDto {
  @ApiPropertyOptional({
    description: 'Filter by the user ID who owns the pin',
  })
  @IsOptional()
  @IsString()
  user_id?: string;

  @ApiPropertyOptional({
    description: 'Filter by the title of the pin',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  title?: string;

  @ApiPropertyOptional({
    description: 'Filter by the description of the pin',
  })
  @IsOptional()
  @IsString()
  @MaxLength(160)
  description?: string;

  @ApiPropertyOptional({
    description: 'Filter by the minimum save count of the pin',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  saveCountMin?: number;

  @ApiPropertyOptional({
    description: 'Filter by the maximum save count of the pin',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  saveCountMax?: number;

  @ApiPropertyOptional({
    description: 'Filter by the minimum like count of the pin',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  likeCountMin?: number;

  @ApiPropertyOptional({
    description: 'Filter by the maximum like count of the pin',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  likeCountMax?: number;

  @ApiPropertyOptional({
    description: 'Filter by the minimum comment count of the pin',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  commentCountMin?: number;

  @ApiPropertyOptional({
    description: 'Filter by the maximum comment count of the pin',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  commentCountMax?: number;
}
