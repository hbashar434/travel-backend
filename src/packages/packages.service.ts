import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { TourPackage, PackageDocument } from "./package.schema";
import { CreatePackageDto } from "./dto/create-package.dto";
import { UpdatePackageDto } from "./dto/update-package.dto";

@Injectable()
export class PackagesService {
  constructor(
    @InjectModel(TourPackage.name) private pkgModel: Model<PackageDocument>
  ) {}

  async create(dto: CreatePackageDto) {
    const created = new this.pkgModel(dto as any);
    return created.save();
  }

  async findAll(search?: string) {
    if (search) {
      const regex = new RegExp(search, "i");
      return this.pkgModel
        .find({ $or: [{ title: regex }, { description: regex }] })
        .exec();
    }
    return this.pkgModel.find().exec();
  }

  async findById(id: string) {
    const p = await this.pkgModel.findById(id).exec();
    if (!p) throw new NotFoundException("Package not found");
    return p;
  }

  async update(id: string, dto: UpdatePackageDto) {
    const updated = await this.pkgModel
      .findByIdAndUpdate(id, dto as any, { new: true })
      .exec();
    if (!updated) throw new NotFoundException("Package not found");
    return updated;
  }

  async remove(id: string) {
    const res = await this.pkgModel.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException("Package not found");
    return { deleted: true };
  }
}
