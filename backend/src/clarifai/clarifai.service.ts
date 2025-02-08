import { Inject, Injectable } from '@nestjs/common'

@Injectable()
export class ClarifaiService {
	constructor(@Inject('CLARIFAI') private readonly clarifai) {}

	async indexImage(imageUrl: string, imageId: string): Promise<void> {
		return new Promise((resolve, reject) => {
			this.clarifai.stub.PostInputs(
				{
					inputs: [
						{
							id: imageId,
							data: {
								image: { url: imageUrl }
							}
						}
					]
				},
				this.clarifai.metadata,
				(err, response) => {
					if (err) return reject(err)
					if (response.status.code !== 10000) {
						return reject(new Error(`Failed to index image: ${response.status.description}`))
					}
					resolve()
				}
			)
		})
	}

	async generateTags(imageUrl: string): Promise<string[]> {
		return new Promise((resolve, reject) => {
			this.clarifai.stub.PostModelOutputs(
				{
					user_app_id: {
						user_id: 'clarifai',
						app_id: 'main'
					},
					model_id: 'general-image-recognition',
					inputs: [
						{
							data: {
								image: { url: imageUrl }
							}
						}
					]
				},
				this.clarifai.metadata,
				(err, response) => {
					if (err) {
						reject(err)
						return
					}

					if (response.status.code !== 10000) {
						reject(new Error(`Failed to analyze image: ${response.status.description}`))
						return
					}

					const tags = response.outputs[0].data.concepts
						.filter((concept) => concept.name !== 'no person')
						.map((concept) => concept.name)
						.slice(0, 5)
					resolve(tags)
				}
			)
		})
	}

	async searchSimilarImages(imageUrl: string): Promise<any[]> {
		const { stub, metadata } = this.clarifai

		return new Promise((resolve, reject) => {
			stub.PostSearches(
				{
					query: {
						data: {
							image: { url: imageUrl }
						}
					}
				},
				metadata,
				(err, response) => {
					if (err) return reject(err)
					if (response.status.code !== 10000) {
						return reject(new Error(`Failed to search images: ${response.status.description}`))
					}
					const results = response.hits.map((hit) => ({
						imageId: hit.input.id,
						score: hit.score
					}))
					resolve(results)
				}
			)
		})
	}
}
