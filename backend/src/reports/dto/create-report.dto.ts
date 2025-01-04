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
	@IsString()
    @IsNotEmpty()
    item_id: string

	@IsNotEmpty()
	@IsEnum(ReportReason)
	reason: ReportReason

    @IsNotEmpty()
    @IsEnum(ReportType)
    type: ReportType
}
