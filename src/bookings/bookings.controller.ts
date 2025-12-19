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
    if (!pkg) {
      throw new (await import("@nestjs/common")).NotFoundException(
        "Package not found"
      );
    }

    const pkgAny = pkg as any;

    // Ensure package is active
    if (pkgAny.status && pkgAny.status !== "active") {
      throw new (await import("@nestjs/common")).BadRequestException(
        "Package is not active"
      );
    }

    const unitPrice = pkgAny.pricePerPerson ?? pkgAny.price ?? 0;

    // Validate travelers against package min/max if present
    if (
      typeof pkgAny.minPersons === "number" &&
      dto.travelers < pkgAny.minPersons
    ) {
      throw new (await import("@nestjs/common")).BadRequestException(
        `Minimum persons for this package is ${pkgAny.minPersons}`
      );
    }
    if (
      typeof pkgAny.maxPersons === "number" &&
      dto.travelers > pkgAny.maxPersons
    ) {
      throw new (await import("@nestjs/common")).BadRequestException(
        `Maximum persons for this package is ${pkgAny.maxPersons}`
      );
    }

    // Validate travelDate against availableDates if provided on package
    if (
      Array.isArray(pkgAny.availableDates) &&
      pkgAny.availableDates.length > 0
    ) {
      const requested = new Date(dto.travelDate).toISOString().split("T")[0];
      const found = pkgAny.availableDates.some((d: any) => {
        const day = new Date(d).toISOString().split("T")[0];
        return day === requested;
      });
      if (!found) {
        throw new (await import("@nestjs/common")).BadRequestException(
          "Requested travel date is not available for this package"
        );
      }
    }

    const totalPrice = unitPrice * dto.travelers;

    // Prepare a package snapshot so bookings remain valid even if package changes later
    const packageSnapshot = {
      unitPrice,
      packageTitle: pkgAny.title,
      packageSlug: pkgAny.slug,
      packageDestination: pkgAny.destination,
    } as any;

    // compute endDate from package durationDays (if available)
    let endDate: Date | undefined = undefined;
    const start = new Date(dto.travelDate);
    if (typeof pkgAny.durationDays === "number" && pkgAny.durationDays > 0) {
      // if durationDays is N, endDate is start + (N - 1) days
      endDate = new Date(start);
      endDate.setDate(endDate.getDate() + (pkgAny.durationDays - 1));
    } else if (
      typeof pkgAny.durationNights === "number" &&
      pkgAny.durationNights > 0
    ) {
      // fallback: durationNights -> endDate = start + durationNights days
      endDate = new Date(start);
      endDate.setDate(endDate.getDate() + pkgAny.durationNights);
    }

    return this.bookings.create({
      ...dto,
      userId,
      totalPrice,
      unitPrice: packageSnapshot.unitPrice,
      packageTitle: packageSnapshot.packageTitle,
      packageSlug: packageSnapshot.packageSlug,
      packageDestination: packageSnapshot.packageDestination,
      endDate,
    } as any);
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
