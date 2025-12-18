import { ApiProperty } from "@nestjs/swagger";

export class CreatePackageDto {
  @ApiProperty({ example: "Amazing Bali Getaway" })
  title: string;

  @ApiProperty({ example: "amazing-bali-getaway" })
  slug: string;

  @ApiProperty({ example: "Short summary of the tour", required: false })
  shortDescription?: string;

  @ApiProperty({
    example: "Seven-day tour of Bali including temples and beaches",
    required: false,
  })
  description?: string;

  @ApiProperty({ example: "Bali", required: false })
  destination?: string;

  @ApiProperty({ example: "beach", required: false })
  category?: string;

  @ApiProperty({ example: "Ngurah Rai Airport", required: false })
  meetingPoint?: string;

  @ApiProperty({ example: ["https://example.com/img1.jpg"], required: false })
  images?: string[];

  @ApiProperty({ example: 999.99 })
  pricePerPerson: number;

  @ApiProperty({ example: 899.99, required: false })
  discountPrice?: number;

  @ApiProperty({ example: 7, required: false })
  durationDays?: number;

  @ApiProperty({ example: 6, required: false })
  durationNights?: number;

  @ApiProperty({ example: ["2025-12-20T00:00:00.000Z"], required: false })
  availableDates?: Date[];

  @ApiProperty({ example: 1, required: false })
  minPersons?: number;

  @ApiProperty({ example: 10, required: false })
  maxPersons?: number;

  @ApiProperty({ example: ["Breakfast", "Guide"], required: false })
  included?: string[];

  @ApiProperty({ example: ["Flights"], required: false })
  excluded?: string[];

  @ApiProperty({ example: "active", required: false })
  status?: string;

  @ApiProperty({ example: true, required: false })
  isFeatured?: boolean;
}
