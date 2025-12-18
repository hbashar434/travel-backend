import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type PackageDocument = TourPackage & Document;

@Schema({ timestamps: true })
export class TourPackage {
  @Prop({ required: true })
  title: string;
  @Prop({ required: true, unique: true })
  slug: string;

  @Prop()
  shortDescription?: string;

  @Prop()
  description?: string;

  @Prop()
  destination?: string;

  @Prop()
  category?: string;

  @Prop()
  meetingPoint?: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ required: true })
  pricePerPerson: number;

  @Prop()
  discountPrice?: number;

  @Prop()
  durationDays?: number;

  @Prop()
  durationNights?: number;

  @Prop({ type: [Date], default: [] })
  availableDates: Date[];

  @Prop()
  minPersons?: number;

  @Prop()
  maxPersons?: number;

  @Prop({ type: [String], default: [] })
  included: string[];

  @Prop({ type: [String], default: [] })
  excluded: string[];

  @Prop({ type: String, enum: ["active", "inactive"], default: "active" })
  status: string;

  @Prop({ type: Boolean, default: false })
  isFeatured: boolean;
}

export const PackageSchema = SchemaFactory.createForClass(TourPackage);
