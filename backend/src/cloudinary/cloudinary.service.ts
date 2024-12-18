import { Injectable } from '@nestjs/common'
import { v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse } from 'cloudinary'
import * as sharp from 'sharp'

@Injectable()
export class CloudinaryService {
	async uploadFile(file: Express.Multer.File, folder: string): Promise<UploadApiResponse | UploadApiErrorResponse> {
		const compressedImageBuffer = await this.compressImage(file)

		return new Promise<UploadApiResponse | UploadApiErrorResponse>((resolve, reject) => {
			cloudinary.uploader
				.upload_stream({ resource_type: 'image', folder }, (error, result) => {
					if (error) return reject(error)
					resolve(result)
				})
				.end(compressedImageBuffer)
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

	private async compressImage(file: Express.Multer.File): Promise<Buffer> {
		const image = sharp(file.buffer)
		const metadata = await image.metadata()

		const maxSize = 1200
		const resizeOptions: sharp.ResizeOptions = { withoutEnlargement: true }

		if (metadata.width > metadata.height) {
			resizeOptions.width = maxSize
		} else {
			resizeOptions.height = maxSize
		}

		const compressedBuffer = await image.resize(resizeOptions).webp({ quality: 75 }).toBuffer()
		return compressedBuffer
	}
}
