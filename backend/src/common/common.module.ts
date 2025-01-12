// Đây là một module chứa các controller chung, có thể sử dụng ở nhiều module khác nhau
import { Module } from '@nestjs/common';
import { GenericService } from './generic/generic.service';

@Module({
  controllers: [],
  providers: []
})
export class CommonModule {}
