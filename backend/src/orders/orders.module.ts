import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { ShippingAddressService } from './shipping-address.service';
import { Order, OrderSchema } from './order.schema';
import { Payment, PaymentSchema } from './payment.schema';
import { ShippingAddress, ShippingAddressSchema } from './shipping-address.schema';
import { Artwork, ArtworkSchema } from '../artworks/artwork.schema';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Payment.name, schema: PaymentSchema },
      { name: ShippingAddress.name, schema: ShippingAddressSchema },
      { name: Artwork.name, schema: ArtworkSchema },
    ]),
    UsersModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, ShippingAddressService],
  exports: [OrdersService, ShippingAddressService],
})
export class OrdersModule {}

