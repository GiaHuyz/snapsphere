import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'

export type BoardPinDocument = HydratedDocument<BoardPin>

@Schema({ timestamps: true })
export class BoardPin {
	@Prop({ required: true })
	user_id: string

	@Prop({ required: true, type: mongoose.Types.ObjectId, ref: 'Board' })
	board_id: string

	@Prop({ required: true, type: mongoose.Types.ObjectId, ref: 'Pin' })
	pin_id: string
}

export const BoardPinSchema = SchemaFactory.createForClass(BoardPin)

BoardPinSchema.index({ board_id: 1, pin_id: 1 }, { unique: true })