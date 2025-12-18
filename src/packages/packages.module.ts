import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PackageSchema, TourPackage } from "./package.schema";
import { PackagesService } from "./packages.service";
import { PackagesController } from "./packages.controller";
import { UploadsModule } from "../uploads/uploads.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TourPackage.name, schema: PackageSchema },
    ]),
    UploadsModule,
  ],
  providers: [PackagesService],
  controllers: [PackagesController],
  exports: [PackagesService],
})
export class PackagesModule {}
