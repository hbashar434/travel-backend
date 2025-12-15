import { ApiProperty } from "@nestjs/swagger";

export class CreatePackageDto {
  @ApiProperty({ example: "Amazing Bali Getaway" })
  title: string;

  @ApiProperty({
    example: "Seven-day tour of Bali including temples and beaches",
  })
  description?: string;

  @ApiProperty({ example: ["https://example.com/img1.jpg"], required: false })
  images?: string[];

  @ApiProperty({ example: 999.99 })
  price: number;

  @ApiProperty({ example: "7 days" })
  duration?: string;
}
