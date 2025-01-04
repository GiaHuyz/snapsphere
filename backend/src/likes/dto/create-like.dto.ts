import { ApiProperty, ApiTags } from '@nestjs/swagger'
import { IsEnum, IsMongoId } from 'class-validator'

export class CreateLikeDto {
	@ApiProperty({ required: true, description: 'The ID of the item that the user likes pin or comment' })
	@IsMongoId()
	item_id: string

	@ApiProperty({
		required: true,
		enum: ['pin', 'comment'],
		description: 'The type of the item that the user likes (pin or comment)'
	})
	@IsEnum(['pin', 'comment'])
	type: string
}
