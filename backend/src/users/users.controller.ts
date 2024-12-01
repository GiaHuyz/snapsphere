import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { GenericController } from '../common/generic/generic.controller';
import { UserDocument } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController extends GenericController<UserDocument> {
  constructor(private readonly userService: UsersService) {
    super(userService);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserDocument> {
    return this.userService.create(createUserDto as any);
  }
}
