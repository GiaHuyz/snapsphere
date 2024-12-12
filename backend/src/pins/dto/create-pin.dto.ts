import { UnprocessableEntityException } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator'
import mongoose, { isObjectIdOrHexString, ObjectId } from 'mongoose'

export class CreatePinDto {
    @ApiProperty()
	@IsString()
	@IsNotEmpty()
	@MaxLength(50)
	@Transform(({ value }) => value.trim())
	title: string

	@ApiProperty({required: false})
	@IsString()
	@IsOptional()
	@MaxLength(160)
	@Transform(({ value }) => value.trim())
	description?: string

    @ApiProperty({required: false})
	@IsOptional()
	@IsUrl()
	@Transform(({ value }) => value.trim())
	link: string

    @ApiProperty({type: 'string', format: 'ObjectId'})
	@IsNotEmpty()
	@Transform(({ value }) => {
		if (!isObjectIdOrHexString(value)) {
			throw new UnprocessableEntityException('Invalid ObjectId')
		}
		return mongoose.Types.ObjectId.createFromHexString(value)
	})
	board_id: ObjectId

    @ApiProperty()
	@IsNotEmpty()
	@IsBoolean()
	@Transform(({ value }) => value === 'true')
	isAllowedComment: boolean

	@ApiProperty({ type: 'string', format: 'binary', required: true })
	image: Express.Multer.File
}
