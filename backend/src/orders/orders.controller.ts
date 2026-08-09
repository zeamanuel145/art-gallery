import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Delete,
  Patch,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ShippingAddressService } from './shipping-address.service';
import { JwtAuthGuard } from '../common/jwt.guard';
import { UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly addressService: ShippingAddressService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  async createOrder(@Req() req: any, @Body() body: any) {
    const userId = req.user?._id || req.user?.id || req.user?.sub || req.user?.userId || body.userId;
    if (!userId) throw new UnauthorizedException('Authentication required to create orders');
    return this.ordersService.createOrder(String(userId), body);
  }

  @Get()
  async getOrders(@Req() req: any) {
    const userId = req.user?._id || req.user?.id || req.user?.userId || req.user?.sub;
    if (!userId) return this.ordersService.getAllOrders();
    return this.ordersService.getOrdersByUser(String(userId));
  }

  @Get('all')
  async getAllOrders(@Req() req: any) {
    let role = req.user?.role;
    if (!role) {
      const id = req.user?.userId || req.user?.sub || req.user?._id || req.user?.id;
      if (id) {
        const dbUser = await this.usersService.findById(String(id));
        role = dbUser?.role;
      }
    }
    if (role !== 'admin') throw new UnauthorizedException('Admin access required');
    return this.ordersService.getAllOrders();
  }

  @Post('addresses')
  async createAddress(@Req() req: any, @Body() body: any) {
    const userId = req.user?._id || req.user?.id || body.userId;
    return this.addressService.createAddress(String(userId), body);
  }

  @Get('addresses')
  async getAddresses(@Req() req: any) {
    const userId = req.user?._id || req.user?.id || req.user?.userId || req.user?.sub;
    return this.addressService.getAddressesByUser(String(userId));
  }

  @Get('addresses/:id')
  async getAddress(@Param('id') id: string, @Req() req: any) {
    const userId = req.user?._id || req.user?.id || req.user?.userId || req.user?.sub;
    return this.addressService.getAddressById(id, String(userId));
  }

  @Patch('addresses/:id')
  async updateAddress(@Param('id') id: string, @Req() req: any, @Body() body: any) {
    const userId = req.user?._id || req.user?.id || req.user?.userId || req.user?.sub;
    return this.addressService.updateAddress(id, String(userId), body);
  }

  @Delete('addresses/:id')
  async deleteAddress(@Param('id') id: string, @Req() req: any) {
    const userId = req.user?._id || req.user?.id;
    return this.addressService.deleteAddress(id, String(userId));
  }

  @Get(':id')
  async getOrder(@Param('id') id: string, @Req() req: any) {
    const userId = req.user?._id || req.user?.id;
    return this.ordersService.getOrderById(id, userId ? String(userId) : undefined);
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.ordersService.updateOrderStatus(id, status);
  }

  @Patch(':id/payment')
  async updatePayment(@Param('id') id: string, @Body() body: { paymentStatus: string; transactionId?: string }) {
    return this.ordersService.updatePaymentStatus(id, body.paymentStatus, body.transactionId);
  }

  @Put(':id/payment-status')
  async confirmPayment(
    @Param('id') id: string,
    @Req() req: any,
    @Body() body: { paymentStatus: string; transactionId?: string },
  ) {
    let role = req.user?.role;
    if (!role) {
      const uid = req.user?.userId || req.user?.sub || req.user?._id || req.user?.id;
      if (uid) {
        const dbUser = await this.usersService.findById(String(uid));
        role = dbUser?.role;
      }
    }
    if (role !== 'admin') throw new UnauthorizedException('Admin access required');
    return this.ordersService.updatePaymentStatus(id, body.paymentStatus, body.transactionId);
  }

  @Patch(':id/track')
  async addTracking(@Param('id') id: string, @Body('trackingNumber') trackingNumber: string) {
    return this.ordersService.addTrackingNumber(id, trackingNumber);
  }

  @Delete(':id')
  async cancelOrder(@Param('id') id: string, @Req() req: any) {
    const userId = req.user?._id || req.user?.id;
    return this.ordersService.cancelOrder(id, String(userId));
  }
}
