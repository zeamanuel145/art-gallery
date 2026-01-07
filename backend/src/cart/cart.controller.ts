import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../common/jwt.guard';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  async getCart(@Request() req) {
    return this.cartService.getCart(req.user.userId);
  }

  @Post('items')
  async addItem(@Body() body: { artworkId: string; quantity?: number }, @Request() req) {
    return this.cartService.addItem(req.user.userId, body.artworkId, body.quantity || 1);
  }

  @Put('items/:artworkId')
  async updateItemQuantity(
    @Param('artworkId') artworkId: string,
    @Body() body: { quantity: number },
    @Request() req
  ) {
    return this.cartService.updateItemQuantity(req.user.userId, artworkId, body.quantity);
  }

  @Delete('items/:artworkId')
  async removeItem(@Param('artworkId') artworkId: string, @Request() req) {
    return this.cartService.removeItem(req.user.userId, artworkId);
  }

  @Delete()
  async clearCart(@Request() req) {
    return this.cartService.clearCart(req.user.userId);
  }
}

