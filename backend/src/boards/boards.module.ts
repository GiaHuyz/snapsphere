import { Board, BoardSchema } from '@/boards/board.schema'
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { BoardsController } from './boards.controller'
import { BoardsService } from './boards.service'

@Module({
	imports: [MongooseModule.forFeature([{ name: Board.name, schema: BoardSchema }])],
	controllers: [BoardsController],
	providers: [BoardsService],
	exports: [MongooseModule]
})
export class BoardsModule {}
