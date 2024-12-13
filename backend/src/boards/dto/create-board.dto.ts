import { UnprocessableEntityException } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsBoolean, IsMongoId, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator'
import mongoose, { isObjectIdOrHexString, ObjectId } from 'mongoose'

export class CreateBoardDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	@MaxLength(50)
	@Transform(({ value }) => value.trim())
	title: string

	@ApiProperty()
	@IsOptional()
	@IsString()
	@MaxLength(160)
	@Transform(({ value }) => value.trim())
	description: string

	@ApiProperty()
	@IsNotEmpty()
	@IsBoolean()
	secret: boolean

	@ApiProperty()
	@IsOptional()
	@Transform(({ value }) => {
		if (!isObjectIdOrHexString(value)) {
			throw new UnprocessableEntityException('Invalid ObjectId')
		}
		return mongoose.Types.ObjectId.createFromHexString(value)
	})
	coverImageId: mongoose.Types.ObjectId
}
