import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArtworksController } from './artworks.controller';
import { ArtworksService } from './artworks.service';
import { Artwork, ArtworkSchema } from './artwork.schema';
import { ArtworkOrder, ArtworkOrderSchema } from './order.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Artwork.name, schema: ArtworkSchema },
      { name: ArtworkOrder.name, schema: ArtworkOrderSchema }
    ])
  ],
  controllers: [ArtworksController],
  providers: [ArtworksService],
})
export class ArtworksModule {}