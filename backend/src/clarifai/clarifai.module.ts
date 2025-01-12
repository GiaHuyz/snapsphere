import { ClarifaiProvider } from '@/clarifai/clarifai.provider'
import { ClarifaiService } from '@/clarifai/clarifai.service'
import { Module } from '@nestjs/common'

@Module({
	providers: [ClarifaiProvider, ClarifaiService],
	exports: [ClarifaiProvider, ClarifaiService]
})
export class ClarifaiModule {}
