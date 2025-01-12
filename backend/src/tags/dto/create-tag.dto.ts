import { ArrayMaxSize, IsArray, IsString, Matches } from 'class-validator'

export class CreateTagDto {
	@IsArray()
	@IsString({ each: true })
	@Matches(/^(?=.*[a-zA-Z])[a-zA-Z0-9 ]+$/, {
		each: true,
		message: 'Tag name must contain at least one letter and can only include letters and numbers'
	})
	@ArrayMaxSize(10)
	name: string
}
