import { BoardPinModule } from '@/board-pin/board-pin.module'
import { CloudinaryModule } from '@/cloudinary/cloudinary.module'
import { Module, forwardRef } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Pin, PinSchema } from './pin.schema'
import { PinsController } from './pins.controller'
import { PinsService } from './pins.service'
import { BoardsModule } from '@/boards/boards.module'

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Pin.name, schema: PinSchema }]), 
        CloudinaryModule, 
        BoardPinModule, 
        forwardRef(() => BoardsModule)
    ],
    controllers: [PinsController],
    providers: [PinsService],
    exports: [MongooseModule]
})
export class PinsModule {}
