import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateCollectionDto {
	@ApiProperty({ description: 'The title of the collection' })
	@IsString()
	@IsNotEmpty()
	title: string

	@ApiProperty({ description: 'The description of the collection' })
    @IsOptional()
	@IsString()
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
