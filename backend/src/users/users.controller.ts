import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { GenericController } from '../common/generic/generic.controller';
import { UserDocument } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController extends GenericController<UserDocument> {
  constructor(private readonly userService: UsersService) {
    super(userService);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserDocument> {
    return this.userService.create(createUserDto as any);
  }


  @Put(':id')
  async replace(@Param('id') id: string, @Body() replaceDto: UpdateUserDto): Promise<UserDocument> {
    return super.replace(id, replaceDto as any);
  }
}
