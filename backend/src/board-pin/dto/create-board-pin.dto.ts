import { UnprocessableEntityException } from "@nestjs/common"
import { Transform } from "class-transformer"
import { IsNotEmpty } from "class-validator"
import mongoose, { isObjectIdOrHexString } from "mongoose"

export class CreateBoardPinDto {
    @IsNotEmpty()
    @Transform(({ value }) => {
        if (!isObjectIdOrHexString(value)) {
            throw new UnprocessableEntityException('Invalid ObjectId')
        }
        return mongoose.Types.ObjectId.createFromHexString(value)
    })
    pin_id: mongoose.Types.ObjectId

    @IsNotEmpty()
    @Transform(({ value }) => {
        if (!isObjectIdOrHexString(value)) {
            throw new UnprocessableEntityException('Invalid ObjectId')
        }
        return mongoose.Types.ObjectId.createFromHexString(value)
    })
    board_id: mongoose.Types.ObjectId
}