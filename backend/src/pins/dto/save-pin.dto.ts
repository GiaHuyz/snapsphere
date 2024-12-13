import { UnprocessableEntityException } from "@nestjs/common"
import { Transform } from "class-transformer"
import { IsNotEmpty } from "class-validator"
import mongoose, { isObjectIdOrHexString, ObjectId } from "mongoose"

export class SavePinDto {
    @IsNotEmpty()
    @Transform(({ value }) => {
        if (!isObjectIdOrHexString(value)) {
            throw new UnprocessableEntityException('Invalid ObjectId')
        }
        return mongoose.Types.ObjectId.createFromHexString(value)
    })
    pinId: mongoose.Types.ObjectId

    @IsNotEmpty()
    @Transform(({ value }) => {
        if (!isObjectIdOrHexString(value)) {
            throw new UnprocessableEntityException('Invalid ObjectId')
        }
        return mongoose.Types.ObjectId.createFromHexString(value)
    })
    boardId: mongoose.Types.ObjectId
}