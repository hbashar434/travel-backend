import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsOptional,
  IsNumber,
  Min,
  IsBoolean,
  IsArray,
  IsISO8601,
} from "class-validator";
import { Type } from "class-transformer";

export class CreatePackageDto {
  @ApiProperty({ example: "Amazing Bali Getaway" })
  @IsString()
  title: string;

  @ApiProperty({ example: "amazing-bali-getaway" })
  @IsString()
  slug: string;

  @ApiProperty({ example: "Short summary of the tour", required: false })
  @IsOptional()
  @IsString()
  shortDescription?: string;

  @ApiProperty({
    example: "Seven-day tour of Bali including temples and beaches",
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: "Bali", required: false })
  @IsOptional()
  @IsString()
  destination?: string;

  @ApiProperty({ example: "beach", required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ example: "Ngurah Rai Airport", required: false })
  @IsOptional()
  @IsString()
  meetingPoint?: string;

  @ApiProperty({ example: ["https://example.com/img1.jpg"], required: false })
  @IsOptional()
  @IsArray()
  images?: string[];

  @ApiProperty({ example: 999.99 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  pricePerPerson: number;

  @ApiProperty({ example: 899.99, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  discountPrice?: number;

  @ApiProperty({ example: 7, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  durationDays?: number;

  @ApiProperty({ example: 6, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  durationNights?: number;

  @ApiProperty({ example: ["2025-12-20T00:00:00.000Z"], required: false })
  @IsOptional()
  @IsArray()
  @IsISO8601({}, { each: true })
  availableDates?: string[];

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minPersons?: number;

  @ApiProperty({ example: 10, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxPersons?: number;

  @ApiProperty({ example: ["Breakfast", "Guide"], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  included?: string[];

  @ApiProperty({ example: ["Flights"], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  excluded?: string[];

  @ApiProperty({ example: "active", required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isFeatured?: boolean;
}
