import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsISO8601, IsNumber, Min } from "class-validator";

export class CreateBookingDto {
  @ApiProperty({ example: "64a1f2ed5c2b1c3a8f0d9e34" })
  @IsString()
  packageId: string;

  @ApiProperty({ example: "2026-01-15" })
  @IsISO8601()
  travelDate: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @Min(1)
  travelers: number;
}
