import { ApiProperty } from "@nestjs/swagger";

export class CreateBookingDto {
  @ApiProperty({ example: "64a1f2ed5c2b1c3a8f0d9e34" })
  packageId: string;

  @ApiProperty({ example: "2026-01-15" })
  travelDate: string;

  @ApiProperty({ example: 2 })
  travelers: number;
}
