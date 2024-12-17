import { Board, BoardSchema } from '@/boards/board.schema'
import { Module, forwardRef } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { BoardsController } from './boards.controller'
import { BoardsService } from './boards.service'
import { PinsModule } from '@/pins/pins.module'
import { PinsService } from '@/pins/pins.service'

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Board.name, schema: BoardSchema }]), 
        forwardRef(() => PinsModule)
    ],
    controllers: [BoardsController],
    providers: [BoardsService],
    exports: [MongooseModule, BoardsService],
    
})
export class BoardsModule {}
