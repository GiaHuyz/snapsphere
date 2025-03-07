import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'

export type CommentDocument = HydratedDocument<Comment>

@Schema({ timestamps: true })
export class Comment {
	@Prop({ required: true })
	user_id: string

	@Prop({ required: true, type: mongoose.Types.ObjectId, ref: 'Pin' })
	pin_id: mongoose.Types.ObjectId

	@Prop({ type: mongoose.Types.ObjectId, ref: 'Comment', default: null })
	parent_id: mongoose.Types.ObjectId

	@Prop({ default: '', maxlength: 1000 })
	content: string

	@Prop({ default: '' })
	image: string

	@Prop({ default: 0 })
	likeCount: number

	@Prop({ default: 0 })
	replyCount: number
}

export const CommentSchema = SchemaFactory.createForClass(Comment)

CommentSchema.index({ pin_id: 1, parent_id: 1 })