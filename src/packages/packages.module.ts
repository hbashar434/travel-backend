import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PackageSchema, TourPackage } from "./package.schema";
import { PackagesService } from "./packages.service";
import { PackagesController } from "./packages.controller";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TourPackage.name, schema: PackageSchema },
    ]),
  ],
  providers: [PackagesService],
  controllers: [PackagesController],
  exports: [PackagesService],
})
export class PackagesModule {}
