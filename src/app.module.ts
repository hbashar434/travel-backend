import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import * as dotenv from "dotenv";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { PackagesModule } from "./packages/packages.module";
import { BookingsModule } from "./bookings/bookings.module";

dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGO_URI || "mongodb://localhost:27017/travel-app"
    ),
    AuthModule,
    UsersModule,
    PackagesModule,
    BookingsModule,
  ],
})
export class AppModule {}
