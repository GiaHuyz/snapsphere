import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@/common/guard/auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { clerkClient } from '@clerk/express';
import { Public } from '@/decorators/public';
import { UserId } from '@/decorators/userId';
import { log } from 'console';


@ApiTags('users')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) { }
  
  // TODO: mapping user từ Clerk sang UserDocument, thêm filter để lọc user
  @Public()
  @ApiOperation({ summary: 'Get user list' })
  @Get()
  async findAll(): Promise<any> {
    const users = clerkClient.users.getUserList();
    return users;
  }
  
  @Get('me')
  @ApiOperation({ summary: 'Get current user', description: 'Only for authenticated user' })
  async getCurrentUser(@UserId() userId: string): Promise<any> {
    const user = clerkClient.users.getUser(userId); 
    log('[DEV]',"[UsersController.getCurrentUser]", user);
    return user;
  }

}
