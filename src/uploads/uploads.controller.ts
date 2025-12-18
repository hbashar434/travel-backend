import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import * as multer from "multer";
import { UploadsService } from "./uploads.service";

@Controller("uploads")
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post("image")
  @UseInterceptors(
    FileInterceptor("image", { storage: multer.memoryStorage() })
  )
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file)
      throw new HttpException("No file provided", HttpStatus.BAD_REQUEST);
    try {
      const url = await this.uploadsService.handleImageUpload(file);
      return { url };
    } catch (err: any) {
      throw new HttpException(
        err.message || "Upload failed",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
