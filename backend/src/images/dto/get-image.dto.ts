import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class GetImagesDto {
  @ApiPropertyOptional({ description: 'Chủ sở hữu của hình ảnh', example: '1234567890' })
  @IsOptional()
  @IsString()
  user_id?: string;

  @ApiPropertyOptional({ description: 'Chủ đề của hình ảnh', example: 'Nature' })
  @IsOptional()
  @IsString()
  theme?: string;

  @ApiPropertyOptional({ description: 'Danh sách các tag cần lọc', example: ['nature', 'landscape'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true, message: 'Tag phải là chuỗi' })
  tags?: string[];

  @ApiPropertyOptional({ description: 'Có công khai hay không', example: true })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true') // Chuyển chuỗi 'true' thành boolean true
  is_public?: boolean;

  @ApiPropertyOptional({ description: 'Tìm kiếm bằng từ khóa mô tả', example: 'thiên nhiên' })
  @IsOptional()
  @IsString()
  search?: string;
}
