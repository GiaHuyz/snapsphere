import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
import { Types } from 'mongoose';

export class CreateImageDto {

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

  // TODO: Thêm kiểm tra collection_id có tồn tại không
  @ApiProperty({ description: 'ID của Collection chứa hình ảnh', example: '1234567890' })
  @IsString()
  @IsNotEmpty({ message: 'Collection ID không được để trống' })
  collection_id: Types.ObjectId;
}
