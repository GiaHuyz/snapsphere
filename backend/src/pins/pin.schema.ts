import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type PinDocument = HydratedDocument<Pin>

@Schema({ timestamps: true })
export class Pin {
	@Prop({ required: true })
	user_id: string

	@Prop({ required: true, maxlength: 50, trim: true })
	title: string

	@Prop({ required: true })
	url: string

	@Prop({ default: '', maxlength: 160, trim: true })
	description: string

	@Prop({ required: true })
	isAllowedComment: boolean

	@Prop({ default: 0 })
	saveCount: number

	@Prop({ default: 0 })
	likeCount: number

	@Prop({ default: 0 })
	commentCount: number
}

export const PinSchema = SchemaFactory.createForClass(Pin)
