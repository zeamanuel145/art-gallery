import { Controller, Get, Post, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ArtworksService } from './artworks.service';
import { JwtAuthGuard } from '../common/jwt.guard';

@Controller('artworks')
export class ArtworksController {
  constructor(private artworksService: ArtworksService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() body: { title: string; description: string; imageUrl: string; price?: number }, @Request() req) {
    return this.artworksService.create(body.title, body.description, body.imageUrl, req.user.userId, body.price);
  }

  @Get()
  async findAll() {
    return this.artworksService.findAll();
  }

  @Get('for-sale')
  async getForSale() {
    return this.artworksService.getForSale();
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-purchases')
  async getMyPurchases(@Request() req) {
    return this.artworksService.getUserPurchases(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-sales')
  async getMySales(@Request() req) {
    return this.artworksService.getUserSales(req.user.userId);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.artworksService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/like')
  async like(@Param('id') id: string, @Request() req) {
    return this.artworksService.toggleLike(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/comment')
  async addComment(@Param('id') id: string, @Body() body: { text: string }, @Request() req) {
    return this.artworksService.addComment(id, req.user.userId, body.text);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/sell')
  async putForSale(@Param('id') id: string, @Body() body: { price: number }, @Request() req) {
    return this.artworksService.putForSale(id, body.price, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/remove-sale')
  async removeFromSale(@Param('id') id: string, @Request() req) {
    return this.artworksService.removeFromSale(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/buy')
  async buyArtwork(@Param('id') id: string, @Request() req) {
    return this.artworksService.buyArtwork(id, req.user.userId);
  }
}