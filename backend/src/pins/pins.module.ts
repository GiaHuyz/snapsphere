import { BoardsModule } from '@/boards/boards.module'
import { CloudinaryModule } from '@/cloudinary/cloudinary.module'
import { Module, forwardRef } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Pin, PinSchema } from './pin.schema'
import { PinsController } from './pins.controller'
import { PinsService } from './pins.service'
import { BoardPinModule } from '@/board-pin/board-pin.module'
import { LikesModule } from '@/likes/likes.module'
import { ClarifaiModule } from '@/clarifai/clarifai.module'
import { TagsModule } from '@/tags/tags.module'

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Pin.name, schema: PinSchema }]),
		CloudinaryModule,
		forwardRef(() => BoardsModule),
        forwardRef(() => BoardPinModule),
        forwardRef(() => LikesModule),
        TagsModule,
        ClarifaiModule
    ],
	controllers: [PinsController],
	providers: [PinsService],
	exports: [MongooseModule, PinsService]
})
export class PinsModule {}
