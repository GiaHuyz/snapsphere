import { Injectable } from '@nestjs/common'
import { v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse } from 'cloudinary'

@Injectable()
export class CloudinaryService {
	async uploadFile(file: Express.Multer.File, folder: string): Promise<UploadApiResponse | UploadApiErrorResponse> {
		return new Promise<UploadApiResponse | UploadApiErrorResponse>((resolve, reject) => {
			cloudinary.uploader
				.upload_stream({ resource_type: 'image', folder, transformation: {
                    width: 1200,
                    height: 1200,
                    crop: 'limit',
                    fetch_format: 'webp',
                    quality: '75'
                } }, (error, result) => {
					if (error) return reject(error)
					resolve(result)
				})
				.end(file.buffer)
		})
	}

	async deleteFile(url: string): Promise<void> {
		const publicId = this.getPublicId(url)
		return new Promise<void>((resolve, reject) => {
			cloudinary.uploader.destroy(publicId, (error, result) => {
				if (error) return reject(error)
				resolve()
			})
		})
	}

	private getPublicId(url: string): string {
		return url.split('/').slice(-2).join('/').split('.')[0]
	}

}
