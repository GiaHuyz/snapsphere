import { UnprocessableEntityException } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'
import mongoose, { isObjectIdOrHexString } from 'mongoose'

export class MergeBoardDto {
	@ApiProperty({
		type: String,
		description: 'Current board id'
	})
	@IsNotEmpty()
	@Transform(({ value }) => {
		if (!isObjectIdOrHexString(value)) {
			throw new UnprocessableEntityException('Invalid ObjectId')
		}
		return mongoose.Types.ObjectId.createFromHexString(value)
	})
	currentBoardId: mongoose.Types.ObjectId

	@ApiProperty({
		type: String,
		description: 'Selected board id'
	})
	@IsNotEmpty()
	@Transform(({ value }) => {
		if (!isObjectIdOrHexString(value)) {
			throw new UnprocessableEntityException('Invalid ObjectId')
		}
		return mongoose.Types.ObjectId.createFromHexString(value)
	})
	selectedBoardId: mongoose.Types.ObjectId
}
