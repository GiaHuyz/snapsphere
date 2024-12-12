import { BoardPin, BoardPinSchema } from '@/board-pin/board-pin.schema'
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

@Module({
	imports: [MongooseModule.forFeature([{ name: BoardPin.name, schema: BoardPinSchema }])],
    exports: [MongooseModule]
})
export class BoardPinModule {}
