import { Controller, Get, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../common/jwt.guard';
import { AdminGuard } from '../common/admin.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(private adminService: AdminService) {}

  // Dashboard Stats
  @Get('dashboard')
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  // User Management
  @Get('users')
  async getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Get('users/:id')
  async getUserById(@Param('id') id: string) {
    return this.adminService.getUserById(id);
  }

  @Put('users/:id')
  async updateUser(@Param('id') id: string, @Body() updateData: any) {
    return this.adminService.updateUser(id, updateData);
  }

  @Put('users/:id/role')
  async updateUserRole(@Param('id') id: string, @Body() body: { role: string }) {
    return this.adminService.updateUserRole(id, body.role);
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  // Artwork Management
  @Get('artworks')
  async getAllArtworks() {
    return this.adminService.getAllArtworks();
  }

  @Get('artworks/:id')
  async getArtworkById(@Param('id') id: string) {
    return this.adminService.getArtworkById(id);
  }

  @Put('artworks/:id')
  async updateArtwork(@Param('id') id: string, @Body() updateData: any) {
    return this.adminService.updateArtwork(id, updateData);
  }

  @Delete('artworks/:id')
  async deleteArtwork(@Param('id') id: string) {
    return this.adminService.deleteArtwork(id);
  }

  // Order Management
  @Get('orders')
  async getAllOrders() {
    return this.adminService.getAllOrders();
  }

  @Get('orders/:id')
  async getOrderById(@Param('id') id: string) {
    return this.adminService.getOrderById(id);
  }
}

