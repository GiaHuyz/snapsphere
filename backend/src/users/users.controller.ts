import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDocument } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@/common/guard/auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { clerkClient } from '@clerk/express';
import { Public } from '@/decorators/public';


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
  async getCurrentUser(@Req() req): Promise<any> {
    const user = req.user; 
    return user;
  }
  
}
