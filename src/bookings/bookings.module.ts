import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { BookingSchema, Booking } from "./booking.schema";
import { BookingsService } from "./bookings.service";
import { BookingsController } from "./bookings.controller";
import { PackagesModule } from "../packages/packages.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
    PackagesModule,
  ],
  providers: [BookingsService],
  controllers: [BookingsController],
  exports: [BookingsService],
})
export class BookingsModule {}
