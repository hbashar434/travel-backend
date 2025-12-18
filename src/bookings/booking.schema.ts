import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type BookingDocument = Booking & Document;

@Schema({ timestamps: true })
export class Booking {
  @Prop({ type: Types.ObjectId, ref: "TourPackage", required: true })
  packageId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  travelDate: Date;

  @Prop({ required: true })
  travelers: number;

  @Prop({ required: true })
  totalPrice: number;

  @Prop()
  unitPrice?: number;

  @Prop()
  packageTitle?: string;

  @Prop()
  packageSlug?: string;

  @Prop()
  packageDestination?: string;

  @Prop({ default: "pending" })
  status: string;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
