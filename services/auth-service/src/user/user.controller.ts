import {
  Controller,
  Get,
  UseGuards,
  Param,
  Request,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('api/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  @UseGuards(JwtGuard)
  async getCurrentUser(@Request() req) {
    return {
      message: 'Current user retrieved',
      data: req.user,
    };
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  async getUserById(@Param('id') id: string) {
    return {
      message: 'User retrieved',
      data: await this.userService.getUserById(id),
    };
  }

  @Get()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN')
  async getAllUsers() {
    return {
      message: 'All users retrieved',
      data: await this.userService.getAllUsers(),
    };
  }

  @Put(':id/deactivate')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN')
  async deactivateUser(@Param('id') id: string) {
    return {
      message: 'User deactivated',
      data: await this.userService.deactivateUser(id),
    };
  }
}
