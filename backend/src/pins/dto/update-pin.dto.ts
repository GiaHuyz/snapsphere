import { PartialType } from '@nestjs/swagger';
import { CreatePinDto } from './create-pin.dto';

export class UpdatePinDto extends PartialType(CreatePinDto) {}
