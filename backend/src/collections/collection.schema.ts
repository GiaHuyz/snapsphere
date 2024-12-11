import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type CollectionDocument = HydratedDocument<Collection>

@Schema({ timestamps: true })
export class Collection {
	@Prop({ required: true })
	user_id: string

	@Prop({ required: true, maxlength: 50, trim: true })
	title: string

	@Prop({ default: '', maxlength: 160, trim: true })
	description: string

	@Prop({ required: true })
	secret: boolean

	@Prop({
		default: [],
		validate: { validator: (value: string[]) => value.length <= 3, message: 'You can add up to 3 cover images' }
	})
	coverImages: string[]
}

export const CollectionSchema = SchemaFactory.createForClass(Collection)
CollectionSchema.index({ user_id: 1, title: 1 })
