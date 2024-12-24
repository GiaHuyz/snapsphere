import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsISO8601, Min } from 'class-validator';

export class BaseFilterDto {
  @ApiPropertyOptional({
    description: 'Filter by start date (from timestamp)',
    example: '2024-12-15T00:00:00.000Z',
  })
  @IsOptional()
  @IsISO8601()
  from?: string;

  @ApiPropertyOptional({
    description: 'Filter by end date (to timestamp)',
    example: '2024-12-16T23:59:59.000Z',
  })
  @IsOptional()
  @IsISO8601()
  to?: string;

  @ApiPropertyOptional({
    description: 'Filter by page number',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Min(1)
  // cast to number
  @Transform(({ value }) => parseInt(value, 10))
  page?: number;

  @ApiPropertyOptional({
    description: 'Filter by page size',
    example: 5,
    default: 10,
  })
  @IsOptional()
  @Min(1)
  // cast to number
  @Transform(({ value }) => parseInt(value, 10))
  pageSize?: number;

}
