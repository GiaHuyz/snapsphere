import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type LikeDocument = HydratedDocument<Like>

@Schema({
	timestamps: true
})
export class Like {
	@Prop({ required: true })
	user_id: string

	@Prop({ required: true })
	item_id: string

	@Prop({ required: true, type: String, enum: ['pin', 'comment'] })
	type: string
}

export const LikeSchema = SchemaFactory.createForClass(Like)
LikeSchema.index({ user_id: 1, item_id: 1 }, { unique: true })
