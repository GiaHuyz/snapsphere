import { Controller } from '@nestjs/common';
import { GenericController } from '../common/generic/generic.controller';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController extends GenericController<User> {
  constructor(private readonly userService: UsersService) {
    super(userService);
  }
}
