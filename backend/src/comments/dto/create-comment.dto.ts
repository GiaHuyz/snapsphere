import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { IsMongoId, IsOptional, IsString, MaxLength } from "class-validator"

export class CreateCommentDto {
    @ApiProperty({ required: true })
    @IsMongoId()
    pin_id: string

    @ApiProperty()
    @IsOptional()
    @IsMongoId()
    parent_id: string

    @ApiProperty()
    @IsOptional()
    @IsString()
    @MaxLength(1000)
    content: string

    @ApiProperty()
    @IsOptional()
    @IsString()
    image: string
}
