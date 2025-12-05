import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArtworksController } from './artworks.controller';
import { ArtworksService } from './artworks.service';
import { Artwork, ArtworkSchema } from './artwork.schema';
import { Order, OrderSchema } from './order.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Artwork.name, schema: ArtworkSchema },
      { name: Order.name, schema: OrderSchema }
    ])
  ],
  controllers: [ArtworksController],
  providers: [ArtworksService],
})
export class ArtworksModule {}