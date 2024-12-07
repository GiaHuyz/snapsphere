import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateImageDto {
  @ApiProperty({ description: 'Chủ sở hữu của hình ảnh', example: '1234567890' })
  @IsString()
  @IsNotEmpty({ message: 'User ID không được để trống' })
  user_id: string;

  @ApiProperty({ description: 'Đường dẫn đến hình ảnh', example: 'https://example.com/image.jpg' })
  @IsString()
  @IsNotEmpty({ message: 'URL không được để trống' })
  @IsUrl({}, { message: 'URL không hợp lệ' })
  url: string;

  @ApiProperty({ description: 'Mô tả của hình ảnh', example: 'Hình ảnh đẹp về thiên nhiên' })
  @IsString()
  @IsNotEmpty({ message: 'Description không được để trống' })
  description: string;

  @ApiProperty({ description: 'Danh sách các tag của hình ảnh', example: ['nature', 'landscape'] })
  @IsArray()
  @IsNotEmpty({ each: true, message: 'Mỗi tag không được để trống' })
  @IsString({ each: true, message: 'Tag phải là chuỗi' })
  tags: string[];

  @ApiProperty({ description: 'Chủ đề của hình ảnh', example: 'Nature', required: false })
  @IsOptional()
  @IsString()
  theme?: string;

  @ApiProperty({ description: 'Có công khai hay không', example: true, default: false })
  @IsBoolean()
  @IsOptional()
  is_public?: boolean;
}
