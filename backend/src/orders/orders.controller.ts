import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ShippingAddressService } from './shipping-address.service';
import { JwtAuthGuard } from '../common/jwt.guard';
import { AdminGuard } from '../common/admin.guard';

@Controller('orders')
export class OrdersController {
  constructor(
    private ordersService: OrdersService,
    private shippingAddressService: ShippingAddressService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createOrder(@Body() orderData: any, @Request() req) {
    return this.ordersService.createOrder(req.user.userId, orderData);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getMyOrders(@Request() req) {
    return this.ordersService.getOrdersByUser(req.user.userId);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('all')
  async getAllOrders() {
    return this.ordersService.getAllOrders();
  }

  // Shipping Address endpoints (must be before :id route)
  @UseGuards(JwtAuthGuard)
  @Get('addresses')
  async getMyAddresses(@Request() req) {
    return this.shippingAddressService.getAddressesByUser(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOrder(@Param('id') id: string, @Request() req) {
    return this.ordersService.getOrderById(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put(':id/status')
  async updateOrderStatus(@Param('id') id: string, @Body() body: { status: string }, @Request() req) {
    return this.ordersService.updateOrderStatus(id, body.status, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/payment-status')
  async updatePaymentStatus(
    @Param('id') id: string,
    @Body() body: { paymentStatus: string; transactionId?: string },
    @Request() req
  ) {
    return this.ordersService.updatePaymentStatus(id, body.paymentStatus, body.transactionId);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put(':id/tracking')
  async addTrackingNumber(@Param('id') id: string, @Body() body: { trackingNumber: string }, @Request() req) {
    return this.ordersService.addTrackingNumber(id, body.trackingNumber);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/cancel')
  async cancelOrder(@Param('id') id: string, @Request() req) {
    return this.ordersService.cancelOrder(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('admin/reports')
  async getSalesReport(@Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.ordersService.getSalesReport(start, end);
  }

  // Shipping Address endpoints
  @UseGuards(JwtAuthGuard)
  @Post('addresses')
  async createAddress(@Body() addressData: any, @Request() req) {
    return this.shippingAddressService.createAddress(req.user.userId, addressData);
  }

  @UseGuards(JwtAuthGuard)
  @Get('addresses/:id')
  async getAddress(@Param('id') id: string, @Request() req) {
    return this.shippingAddressService.getAddressById(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('addresses/:id')
  async updateAddress(@Param('id') id: string, @Body() updateData: any, @Request() req) {
    return this.shippingAddressService.updateAddress(id, req.user.userId, updateData);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('addresses/:id')
  async deleteAddress(@Param('id') id: string, @Request() req) {
    return this.shippingAddressService.deleteAddress(id, req.user.userId);
  }
}

