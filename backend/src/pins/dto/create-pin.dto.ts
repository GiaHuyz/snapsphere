import { BadRequestException, Optional, UnprocessableEntityException } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength, ValidateIf } from 'class-validator'
import { log } from 'console'
import mongoose, { isObjectIdOrHexString, ObjectId } from 'mongoose'

export class CreatePinDto {
	@ApiProperty({
		type: 'string',
		required: false,
		description: 'The title of the pin, this field will help users to find the pin easily',
	}
	)
	@IsString()
	@MaxLength(50)
	@IsOptional()
	@Transform(({ value }) => value.trim())
	title: string

	@ApiProperty({
		required: false,
		description: 'Description of the pin, this field will help users to understand the pin'
	})
	@IsString()
	@IsOptional()
	@MaxLength(160)
	@Transform(({ value }) => value.trim())
	description?: string

	@ApiProperty({
		required: false,
		description: 'If the pin is secret'
	})
	@IsOptional()
	@IsBoolean()
	@Transform(({ value }) => value === 'true' || value === true)
	secret?: boolean

	@ApiProperty({
		required: true,
		description: 'If the pin is allowed to be commented by other users'
	})
	@IsNotEmpty()
	@IsBoolean()
    @Transform(({ value }) => value === 'true' || value === true)
	isAllowedComment: boolean

	@ApiProperty({
		required: false,
		description: 'The reference link of the pin, this field will help users to find the original source of the pin'
	})
	@IsOptional()
	@IsUrl()
	@MaxLength(2048)
    @ValidateIf((object, value) => value !== '')
	referenceLink?: string

	@ApiProperty({
		type: 'string',
		format: 'binary',
		required: true,
		description: 'The '
	})
	image: Express.Multer.File

    @ApiProperty({
        required: true,
        description: 'The url uploaded'
    })
    @IsOptional()
    @ValidateIf((object, value) => value !== '')
    url?: string

    @ApiProperty({
        required: true,
        description: 'The tags of the pin'
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @Transform(({ value }) => value.map((name: string) => name.trim().toLowerCase()))
    tags?: string[]
}
