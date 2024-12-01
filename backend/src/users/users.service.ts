import { Injectable } from '@nestjs/common';
import { GenericService } from '../common/generic/generic.service';
import { User } from './user.entity';

@Injectable()
export class UsersService extends GenericService<User> {}
