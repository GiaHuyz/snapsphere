import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator'

export class CreateCollectionDto {
	@ApiProperty({ description: 'The title of the collection' })
	@IsString()
	@IsNotEmpty()
    @MaxLength(50)
    @Transform(({ value }) => value.trim())
	title: string

	@ApiProperty({ description: 'The description of the collection' })
    @IsOptional()
	@IsString()
	@MaxLength(160)
	@Transform(({ value }) => value.trim())
	description: string

	@ApiProperty({ description: 'Whether the collection is public' })
	@IsNotEmpty()
	@IsBoolean()
	secret: boolean

	@ApiProperty({ description: 'The image of the collection' })
	@IsOptional()
	@IsString()
	coverImage: string
}
