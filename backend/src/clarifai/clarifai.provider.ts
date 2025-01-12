import { Provider } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
const { ClarifaiStub, grpc } = require('clarifai-nodejs-grpc')

export const ClarifaiProvider: Provider = {
	provide: 'CLARIFAI',
	inject: [ConfigService],
	useFactory: (configService: ConfigService) => {
		const stub = ClarifaiStub.grpc()
		const metadata = new grpc.Metadata()
		metadata.set('authorization', `Key ${configService.get<string>('CLARIFAI_API_KEY')}`)
		return { stub, metadata }
	}
}
