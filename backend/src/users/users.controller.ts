import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { GenericController } from '../common/generic/generic.controller';
import { UserDocument } from './user.schema';

@Controller('users')
export class UsersController extends GenericController<UserDocument> {
  constructor(private readonly userService: UsersService) {
    super(userService);
  }
}
