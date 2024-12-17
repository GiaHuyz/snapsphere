import { BoardPinController } from '@/board-pin/board-pin.controller'
import { BoardPin, BoardPinSchema } from '@/board-pin/board-pin.schema'
import { BoardPinService } from '@/board-pin/board-pin.service'
import { BoardsModule } from '@/boards/boards.module'
import { BoardsService } from '@/boards/boards.service'
import { PinsModule } from '@/pins/pins.module'
import { PinsService } from '@/pins/pins.service'
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

@Module({
	imports: [MongooseModule.forFeature([{ name: BoardPin.name, schema: BoardPinSchema }]), BoardsModule, PinsModule],
    controllers: [BoardPinController],
    providers: [BoardPinService]
})
export class BoardPinModule {}
