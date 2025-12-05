import { Controller, Get, Put, Body, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/jwt.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req) {
    try {
      return this.usersService.findById(req.user.userId);
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async updateProfile(@Req() req, @Body() updateData: any) {
    try {
      return this.usersService.updateProfile(req.user.userId, updateData);
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }
}
