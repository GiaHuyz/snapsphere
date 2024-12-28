import { BoardsModule } from '@/boards/boards.module'
import { CloudinaryModule } from '@/cloudinary/cloudinary.module'
import { Module, forwardRef } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Pin, PinSchema } from './pin.schema'
import { PinsController } from './pins.controller'
import { PinsService } from './pins.service'
import { BoardPinModule } from '@/board-pin/board-pin.module'

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Pin.name, schema: PinSchema }]),
		CloudinaryModule,
		forwardRef(() => BoardsModule),
        BoardPinModule
	],
	controllers: [PinsController],
	providers: [PinsService],
	exports: [MongooseModule, PinsService]
})
export class PinsModule {}
