import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type PackageDocument = TourPackage & Document;

@Schema({ timestamps: true })
export class TourPackage {
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ required: true })
  price: number;

  @Prop()
  duration?: string;
}

export const PackageSchema = SchemaFactory.createForClass(TourPackage);
