import { CloudinaryProvider } from '@/cloudinary/cloudinary.provider';
import { CloudinaryService } from '@/cloudinary/cloudinary.service';
import { Module } from '@nestjs/common'

@Module({
	providers: [CloudinaryProvider, CloudinaryService],
	exports: [CloudinaryProvider, CloudinaryService]
})
export class CloudinaryModule {}
