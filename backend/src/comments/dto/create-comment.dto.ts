import { UnprocessableEntityException } from "@nestjs/common"
import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { IsMongoId, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator"
import mongoose, { isObjectIdOrHexString } from "mongoose"

export class CreateCommentDto {
    @ApiProperty({ required: true })
    @IsNotEmpty()
    @Transform(({ value }) => {
        if (!isObjectIdOrHexString(value)) {
            throw new UnprocessableEntityException('Invalid ObjectId')
        }
        return mongoose.Types.ObjectId.createFromHexString(value)
    })
    pin_id: mongoose.Types.ObjectId

    @ApiProperty()
    @IsOptional()
    @Transform(({ value }) => {
        if (!isObjectIdOrHexString(value)) {
            throw new UnprocessableEntityException('Invalid ObjectId')
        }
        return mongoose.Types.ObjectId.createFromHexString(value)
    })
    parent_id: mongoose.Types.ObjectId

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
