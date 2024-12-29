import { BoardPinModule } from '@/board-pin/board-pin.module'
import { Board, BoardSchema } from '@/boards/board.schema'
import { PinsModule } from '@/pins/pins.module'
import { Module, forwardRef } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { BoardsController } from './boards.controller'
import { BoardsService } from './boards.service'

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Board.name, schema: BoardSchema }]),
		PinsModule,
		forwardRef(() => BoardPinModule)
	],
	controllers: [BoardsController],
	providers: [BoardsService],
	exports: [MongooseModule, BoardsService]
})
export class BoardsModule {}
