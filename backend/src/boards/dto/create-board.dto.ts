import { UnprocessableEntityException } from '@nestjs/common'
import { ApiOperation, ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsBoolean, IsMongoId, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator'
import mongoose, { isObjectIdOrHexString, ObjectId } from 'mongoose'

export class CreateBoardDto {
	@ApiProperty({
		example: 'My lovely cats',
		description: 'The title of the board, this field will help users to find the board easily',
	})
	@IsString()
	@IsNotEmpty()
	@MaxLength(50)
	@Transform(({ value }) => value.trim())
	title: string

	@ApiProperty({
		example: 'A collection of my lovely cats',
		description: 'Description of the board, this field will help users to understand the board',
	})
	@IsOptional()
	@IsString()
	@MaxLength(160)
	@Transform(({ value }) => value.trim())
	description: string

	@ApiProperty({
		example: false,
		description: 'If the board is private or public',
	})
	@IsNotEmpty()
	@IsBoolean()
	@Transform(({ value }) => value === 'true')
	secret: boolean

	@ApiProperty({
		example: '[]',
		description: 'The id of the pin that will be used as the cover image of the board',
	})
	@IsOptional()
	@Transform(({ value }) => {
		// if the value is not an array
		if (!Array.isArray(value)) {
			throw new UnprocessableEntityException('Not an array')
		}
        if(value.length > 3) {
            throw new UnprocessableEntityException('Too many cover images')
        }
		// if the value is an array
		for (const val of value) {
			if (!isObjectIdOrHexString(val)) {
				throw new UnprocessableEntityException('Invalid ObjectId')
			}
		}
		return value.map((val) => mongoose.Types.ObjectId.createFromHexString(val))
	})
	coverImageIds?: Array<mongoose.Types.ObjectId>
}
