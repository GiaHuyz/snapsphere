import { ApiProperty } from '@nestjs/swagger';

export class CreateImageDto {
  @ApiProperty({ description: 'Chủ sở hữu của hình ảnh', example: '1234567890' })
  user_id: string;

  @ApiProperty({ description: 'Đường dẫn đến hình ảnh', example: 'https://example.com/image.jpg' })
  url: string;

  @ApiProperty({ description: 'Mô tả của hình ảnh', example: 'Hình ảnh đẹp về thiên nhiên' })
  description: string;

  @ApiProperty({ description: 'Danh sách các tag của hình ảnh', example: ['nature', 'landscape'] })
  tags: string[];

  @ApiProperty({ description: 'Chủ đề của hình ảnh', example: 'Nature', required: false })
  theme?: string;

  @ApiProperty({ description: 'Có công khai hay không', example: true, default: false })
  is_public?: boolean;
}
