import { Pin } from '@/pins/pin.schema'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'

export type BoardDocument = HydratedDocument<Board>

@Schema({ timestamps: true })
export class Board {
	// the collection of pins
	@Prop({ required: true })
	user_id: string // the owner of the board

	@Prop({ required: true, maxlength: 50, trim: true })
	title: string // name of the board

	@Prop({ default: '', maxlength: 160, trim: true, required: false })
	description: string // short description of the board

	@Prop({ required: true })
	secret: boolean // if the board is private or public

	@Prop({ default: 0 })
	pinCount: number // number of pins in the board

	@Prop({
		type: [mongoose.Types.ObjectId],
		ref: Pin.name,
		required: false,
		default: [],
		validate: {
			validator: function (value: mongoose.Types.ObjectId[]) {
				return value.length <= 3
			},
			message: 'Board can have a maximum of 3 cover images'
		}
	})
	coverImages: mongoose.Types.ObjectId[] // cover images of the board
}

export const BoardSchema = SchemaFactory.createForClass(Board)
BoardSchema.index({ user_id: 1, title: 1 })
