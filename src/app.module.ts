import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import * as dotenv from "dotenv";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { PackagesModule } from "./packages/packages.module";
import { BookingsModule } from "./bookings/bookings.module";
import { UploadsModule } from "./uploads/uploads.module";

dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI),
    AuthModule,
    UsersModule,
    PackagesModule,
    BookingsModule,
    UploadsModule,
  ],
})
export class AppModule {}
