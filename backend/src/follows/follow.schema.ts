import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type FollowDocument = HydratedDocument<Follow>

@Schema({ timestamps: true })
export class Follow {
	@Prop({ required: true })
	follower_id: string

	@Prop({ required: true })
	following_id: string
}

export const FollowSchema = SchemaFactory.createForClass(Follow)
FollowSchema.index({ follower_id: 1, following_id: 1 }, { unique: true })
