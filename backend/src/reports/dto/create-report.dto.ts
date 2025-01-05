import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator'
import mongoose, { isObjectIdOrHexString } from 'mongoose'

enum ReportReason {
	SPAM = 'spam',
	NUDITY = 'nudity',
	SELF_HARM = 'self-harm',
	MISINFORMATION = 'misinformation',
	HATE = 'hate',
	DANGEROUS = 'dangerous',
	HARASSMENT = 'harassment',
	VIOLENCE = 'violence',
	PRIVACY = 'privacy',
	INTELLECTUAL_PROPERTY = 'intellectual-property'
}

enum ReportType {
	PIN = 'pin',
	COMMENT = 'comment',
	USER = 'user'
}

export class CreateReportDto {

	@ApiProperty({
		example: '60b9f7a7d1b0f0001f000001',
		description: 'The id of the item that is being reported',
	})
	@IsString()
	@IsNotEmpty()
	item_id: string

	@ApiProperty({
		example: 'spam',
		description: 'The reason for the report: "spam|nudity|self-harm|misinformation|hate|dangerous|harassment|violence|privacy|intellectual-property"',	
	})
	@IsNotEmpty()
	@IsEnum(ReportReason)
	reason: ReportReason

	@ApiProperty({
		example: 'pin',
		description: 'The type of the item that is being reported: "pin|comment|user"',
	})
	@IsNotEmpty()
	@IsEnum(ReportType)
	type: ReportType
}
