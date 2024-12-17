import { UnprocessableEntityException } from "@nestjs/common"
import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { IsNotEmpty } from "class-validator"
import mongoose, { isObjectIdOrHexString } from "mongoose"

export class CreateBoardPinDto {
    @ApiProperty({
        type: String,
        description: 'Pin id',
    })
    @IsNotEmpty()
    @Transform(({ value }) => {
        if (!isObjectIdOrHexString(value)) {
            throw new UnprocessableEntityException('Invalid ObjectId')
        }
        return mongoose.Types.ObjectId.createFromHexString(value)
    })
    pin_id: mongoose.Types.ObjectId

    @ApiProperty({
        type: String,
        description: 'Board id'
    })
    @IsNotEmpty()
    @Transform(({ value }) => {
        if (!isObjectIdOrHexString(value)) {
            throw new UnprocessableEntityException('Invalid ObjectId')
        }
        return mongoose.Types.ObjectId.createFromHexString(value)
    })
    board_id: mongoose.Types.ObjectId
}