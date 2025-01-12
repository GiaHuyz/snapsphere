import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import mongoose, { HydratedDocument } from 'mongoose'

export type ReportDocument = HydratedDocument<Report>

@Schema({ timestamps: true })
export class Report {
    @ApiProperty({ required: true, description: 'The ID of the user who reported the item' })
	@Prop({ required: true })
	user_id: string

    @ApiProperty({ required: true, description: 'The ID of the item being reported pin, comment, or user' })
	@Prop({ required: true, type: mongoose.Schema.Types.Mixed })
    item_id: mongoose.Schema.Types.Mixed

    @ApiProperty({ required: true, description: 'The reason for the report' })
	@Prop({
		required: true,
		type: String,
		enum: [
			'spam',
			'nudity',
			'self-harm',
			'misinformation',
			'hate',
			'dangerous',
			'harassment',
			'violence',
			'privacy',
			'intellectual-property'
		]
	})
	reason: string

    @ApiProperty({ required: true, description: 'The type of the item being reported pin, comment, or user' })
    @Prop({ required: true, type: String, enum: ['pin', 'comment', 'user'] })
    type: string
}

export const ReportSchema = SchemaFactory.createForClass(Report)
