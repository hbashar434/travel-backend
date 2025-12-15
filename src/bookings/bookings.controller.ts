import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Req,
} from "@nestjs/common";
import { BookingsService } from "./bookings.service";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { JwtGuard } from "../auth/jwt.guard";
import { Roles } from "../auth/roles.decorator";
import { RolesGuard } from "../auth/roles.guard";
import { PackagesService } from "../packages/packages.service";

@ApiTags("bookings")
@Controller("bookings")
export class BookingsController {
  constructor(
    private bookings: BookingsService,
    private pkgs: PackagesService
  ) {}

  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a booking (authenticated user)" })
  @Post()
  async create(@Body() dto: CreateBookingDto, @Req() req: any) {
    const userId = req.user?.sub;
    const pkg = await this.pkgs.findById(dto.packageId);
    const totalPrice = (pkg.price || 0) * dto.travelers;
    return this.bookings.create({ ...dto, userId, totalPrice } as any);
  }

  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @Get("me")
  @ApiOperation({ summary: "Get bookings for logged-in user" })
  async myBookings(@Req() req: any) {
    const userId = req.user?.sub;
    return this.bookings.findByUser(userId);
  }

  // Admin: view all bookings
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles("admin")
  @Get()
  @ApiOperation({ summary: "Get all bookings (admin)" })
  async all() {
    return this.bookings.findAll();
  }

  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles("admin")
  @Put(":id/status")
  @ApiOperation({ summary: "Update booking status (admin)" })
  async updateStatus(
    @Param("id") id: string,
    @Body() body: { status: string }
  ) {
    return this.bookings.updateStatus(id, body.status);
  }
}
