import { UserId } from '@/decorators/userId'
import { MulterInterceptor } from '@/interceptors/multer.interceptor'
import { Body, Controller, Delete, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger'
import { CreatePinDto } from './dto/create-pin.dto'
import { PinsService } from './pins.service'
import { Public } from '@/decorators/public'
import { ObjectId } from 'mongoose'
import { SavePinDto } from '@/pins/dto/save-pin.dto'

@ApiTags('Pins')
@Controller('pins')
export class PinsController {
	constructor(private readonly pinsService: PinsService) {}

    @ApiBody({type: CreatePinDto})
    @ApiConsumes('multipart/form-data')
	@Post()
	@UseInterceptors(MulterInterceptor('image'))
	create(@UserId() userId: string, @UploadedFile() image: Express.Multer.File, @Body() createPinDto: CreatePinDto) {
		return this.pinsService.create(userId, createPinDto, image)
	}

    @Post('save-to-board')
    savePinToBoard(@UserId() userId: string, @Body() savePinDto: SavePinDto) {
        return this.pinsService.savePinToBoard(userId, savePinDto)
    }

    @Delete(':id')
    delete(@UserId() userId: string, @Param('id') id: string) {
        return this.pinsService.delete(id, userId)
    }

    @Get()
    @Public()
    findAllPinsByUserId(@UserId() userId: string) {
        return this.pinsService.findAllPinsByUserId(userId)
    }
}
