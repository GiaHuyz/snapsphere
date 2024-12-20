'use server'

import { v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse } from 'cloudinary'

const cloudinaryConfig = {
	cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
	api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
	api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET
}

cloudinary.config(cloudinaryConfig)

export const uploadToCloudinary = async (image: File, userId: string) => {
	try {
		const buffer = Buffer.from(await image.arrayBuffer())

		const result = new Promise<UploadApiResponse | UploadApiErrorResponse>((resolve, reject) => {
			cloudinary.uploader
				.upload_stream(
					{
						resource_type: 'image',
						folder: userId,
						transformation: {
							width: 1200,
							height: 1200,
							crop: 'limit',
							fetch_format: 'webp',
							quality: '75'
						}
					},
					(error, result) => {
						if (error) return reject(error)
						resolve(result as UploadApiResponse)
					}
				)
				.end(buffer)
		})

		const { secure_url } = await result

		return secure_url
	} catch (error) {
		console.error('Error uploading to Cloudinary:', error)
	}
}
