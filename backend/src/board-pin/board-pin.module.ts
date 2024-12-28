import { BoardPinController } from '@/board-pin/board-pin.controller'
import { BoardPin, BoardPinSchema } from '@/board-pin/board-pin.schema'
import { BoardPinService } from '@/board-pin/board-pin.service'
import { BoardsModule } from '@/boards/boards.module'
import { PinsModule } from '@/pins/pins.module'
import { forwardRef, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

@Module({
	imports: [
		MongooseModule.forFeature([{ name: BoardPin.name, schema: BoardPinSchema }]),
		forwardRef(() => PinsModule),
		forwardRef(() => BoardsModule),
	],
	controllers: [BoardPinController],
	providers: [BoardPinService],
	exports: [MongooseModule]
})
export class BoardPinModule {}
