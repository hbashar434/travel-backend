import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Booking, BookingDocument } from "./booking.schema";
import { CreateBookingDto } from "./dto/create-booking.dto";

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>
  ) {}

  async create(
    dto: CreateBookingDto & {
      userId: string;
      totalPrice: number;
      unitPrice?: number;
      packageTitle?: string;
      packageSlug?: string;
      packageDestination?: string;
    }
  ) {
    const created = new this.bookingModel({
      packageId: new Types.ObjectId(dto.packageId),
      userId: new Types.ObjectId(dto.userId),
      travelDate: new Date(dto.travelDate),
      travelers: dto.travelers,
      totalPrice: dto.totalPrice,
      unitPrice: dto.unitPrice,
      packageTitle: dto.packageTitle,
      packageSlug: dto.packageSlug,
      packageDestination: dto.packageDestination,
    } as any);
    return created.save();
  }

  async findByUser(userId: string) {
    return this.bookingModel.find({ userId }).populate("packageId").exec();
  }

  async findAll() {
    return this.bookingModel.find().populate("packageId userId").exec();
  }

  async updateStatus(id: string, status: string) {
    const updated = await this.bookingModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .exec();
    if (!updated) throw new NotFoundException("Booking not found");
    return updated;
  }
}
