import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  Req,
} from "@nestjs/common";
import { PackagesService } from "./packages.service";
import { CreatePackageDto } from "./dto/create-package.dto";
import { UpdatePackageDto } from "./dto/update-package.dto";
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { JwtGuard } from "../auth/jwt.guard";
import { Roles } from "../auth/roles.decorator";
import { RolesGuard } from "../auth/roles.guard";

@ApiTags("packages")
@Controller("packages")
export class PackagesController {
  constructor(private pkgService: PackagesService) {}

  @Get()
  @ApiOperation({ summary: "List all tour packages or search by ?search=term" })
  async list(@Query("search") search?: string) {
    return this.pkgService.findAll(search);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get package details by id" })
  async details(@Param("id") id: string) {
    return this.pkgService.findById(id);
  }

  // Admin routes
  @Post()
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles("admin")
  @ApiOperation({ summary: "Create a new tour package (admin)" })
  async create(@Body() dto: CreatePackageDto, @Req() req: any) {
    return this.pkgService.create(dto);
  }

  @Put(":id")
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles("admin")
  @ApiOperation({ summary: "Update a tour package (admin)" })
  async update(@Param("id") id: string, @Body() dto: UpdatePackageDto) {
    return this.pkgService.update(id, dto);
  }

  @Delete(":id")
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles("admin")
  @ApiOperation({ summary: "Delete a tour package (admin)" })
  async remove(@Param("id") id: string) {
    return this.pkgService.remove(id);
  }
}
