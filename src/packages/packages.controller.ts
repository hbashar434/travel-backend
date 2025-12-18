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
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from "@nestjs/common";
import { PackagesService } from "./packages.service";
import { CreatePackageDto } from "./dto/create-package.dto";
import { UpdatePackageDto } from "./dto/update-package.dto";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiConsumes,
  ApiBody,
} from "@nestjs/swagger";
import { JwtGuard } from "../auth/jwt.guard";
import { Roles } from "../auth/roles.decorator";
import { RolesGuard } from "../auth/roles.guard";
import { FilesInterceptor } from "@nestjs/platform-express";
import * as multer from "multer";
import { UploadsService } from "../uploads/uploads.service";

@ApiTags("packages")
@Controller("packages")
export class PackagesController {
  constructor(
    private pkgService: PackagesService,
    private uploadsService: UploadsService
  ) {}

  private readonly MAX_IMAGES_PER_PACKAGE: number =
    Number(process.env.MAX_IMAGES_PER_PACKAGE) || 10;

  // read environment limits at module load time
  private readonly MAX_UPLOAD_BYTES: number =
    (Number(process.env.MAX_UPLOAD_SIZE_MB) || 10) * 1024 * 1024;

  private imageFileFilter = (
    req: any,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ) => {
    const allowed = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(null, false);
  };

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
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        images: {
          type: "array",
          items: { type: "string", format: "binary" },
        },
      },
    },
  })
  @UseInterceptors(
    FilesInterceptor(
      "images",
      Number(process.env.MAX_IMAGES_PER_PACKAGE) || 10,
      {
        storage: multer.memoryStorage(),
        limits: {
          fileSize:
            (Number(process.env.MAX_UPLOAD_SIZE_MB) || 10) * 1024 * 1024,
        },
        fileFilter: (req, file, cb) => {
          const allowed = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
            "image/gif",
          ];
          if (allowed.includes(file.mimetype)) cb(null, true);
          else cb(null, false);
        },
      }
    )
  )
  async create(
    @Body() dto: CreatePackageDto,
    @UploadedFiles() files?: Express.Multer.File[],
    @Req() req?: any
  ) {
    if (files && files.length > 0) {
      // enforce maximum images per package
      const max = this.MAX_IMAGES_PER_PACKAGE;
      if (files.length > max) {
        throw new BadRequestException(`Maximum ${max} images are allowed`);
      }
      const urls: string[] = [];
      for (const f of files) {
        const url = await this.uploadsService.handleImageUpload(f);
        urls.push(url);
      }
      dto.images = urls;
    }
    return this.pkgService.create(dto);
  }

  @Put(":id")
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles("admin")
  @ApiOperation({ summary: "Update a tour package (admin)" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        images: {
          type: "array",
          items: { type: "string", format: "binary" },
        },
      },
    },
  })
  @UseInterceptors(
    FilesInterceptor(
      "images",
      Number(process.env.MAX_IMAGES_PER_PACKAGE) || 10,
      {
        storage: multer.memoryStorage(),
        limits: {
          fileSize:
            (Number(process.env.MAX_UPLOAD_SIZE_MB) || 10) * 1024 * 1024,
        },
        fileFilter: (req, file, cb) => {
          const allowed = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
            "image/gif",
          ];
          if (allowed.includes(file.mimetype)) cb(null, true);
          else cb(new Error("Only image files are allowed"), false);
        },
      }
    )
  )
  async update(
    @Param("id") id: string,
    @Body() dto: UpdatePackageDto,
    @UploadedFiles() files?: Express.Multer.File[],
    @Req() req?: any
  ) {
    // If files were uploaded, either replace existing images (one-to-one by index)
    // when query param ?replace=true is set, otherwise append new images.
    const pkg = await this.pkgService.findById(id);

    if (files && files.length > 0) {
      const replaceMode = req?.query?.replace === "true";
      const existing: string[] = Array.isArray(pkg.images) ? pkg.images : [];

      if (replaceMode) {
        // Overwrite existing images by index; if no existing at index, upload as new
        for (let i = 0; i < files.length; i++) {
          const f = files[i];
          if (existing[i]) {
            await this.uploadsService.replaceFile(existing[i], f);
            // keep the same path in existing array
          } else {
            const url = await this.uploadsService.handleImageUpload(f);
            existing.push(url);
          }
        }
        dto.images = existing;
      } else {
        // append mode
        const urls: string[] = [];
        for (const f of files) {
          const url = await this.uploadsService.handleImageUpload(f);
          urls.push(url);
        }
        dto.images = [...existing, ...urls];
      }
      const max = this.MAX_IMAGES_PER_PACKAGE;
      const finalCount = dto.images
        ? dto.images.length
        : Array.isArray(pkg.images)
        ? pkg.images.length
        : 0;
      if (finalCount > max) {
        throw new BadRequestException(`Maximum ${max} images are allowed`);
      }
    }

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
