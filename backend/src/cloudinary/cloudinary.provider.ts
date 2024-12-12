import { Provider } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { v2 as cloudinary } from 'cloudinary'

export const CloudinaryProvider: Provider = {
	provide: 'CLOUDINARY',
	inject: [ConfigService],
	useFactory: (configService: ConfigService) => {
		return cloudinary.config({
			cloud_name: configService.get<string>('CLOUDINARY_CLOUD_NAME'),
			api_key: configService.get<string>('CLOUDINARY_API_KEY'),
			api_secret: configService.get<string>('CLOUDINARY_API_SECRET')
		})
	}
}
