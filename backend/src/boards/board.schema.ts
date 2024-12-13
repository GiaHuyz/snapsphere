import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument, mongo } from 'mongoose'

export type BoardDocument = HydratedDocument<Board>

@Schema({ timestamps: true })
export class Board {
	@Prop({ required: true })
	user_id: string

	@Prop({ required: true, maxlength: 50, trim: true })
	title: string

	@Prop({ default: '', maxlength: 160, trim: true })
	description: string

	@Prop({ required: true })
	secret: boolean

	@Prop({ default: 0 })
	pinCount: number

	@Prop({ type: [{ pin_id: mongoose.Types.ObjectId, url: String }] })
	coverImages: Array<{ pin_id: mongoose.Types.ObjectId; url: string }>
}

export const BoardSchema = SchemaFactory.createForClass(Board)
BoardSchema.index({ user_id: 1, title: 1 })
