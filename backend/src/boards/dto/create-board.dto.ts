import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator'

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
	@IsString()
	coverImage: string
}
