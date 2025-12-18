import { Injectable } from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";
import * as sharp from "sharp";

@Injectable()
export class UploadsService {
  private uploadsPath = path.join(process.cwd(), "uploads");
  private maxSizeBytes: number;

  constructor() {
    this.maxSizeBytes =
      (Number(process.env.MAX_IMAGE_SIZE_MB) || 2) * 1024 * 1024;
    fs.mkdirSync(this.uploadsPath, { recursive: true });
  }

  async handleImageUpload(file: Express.Multer.File): Promise<string> {
    if (!file || !file.buffer) throw new Error("Invalid file");

    let buffer = file.buffer;

    if (buffer.length > this.maxSizeBytes) {
      buffer = await this.compressToTarget(buffer, this.maxSizeBytes);
    }

    const ext =
      this.getExtension(file.mimetype) ||
      path.extname(file.originalname) ||
      ".jpg";
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    const filepath = path.join(this.uploadsPath, filename);

    await fs.promises.writeFile(filepath, buffer);

    // Return the public path that can be served statically
    return `/uploads/${filename}`;
  }

  private getExtension(mime: string) {
    if (!mime) return null;
    if (mime === "image/jpeg" || mime === "image/jpg") return ".jpg";
    if (mime === "image/png") return ".png";
    if (mime === "image/webp") return ".webp";
    if (mime === "image/gif") return ".gif";
    return null;
  }

  private async compressToTarget(
    buffer: Buffer,
    maxBytes: number
  ): Promise<Buffer> {
    // Try progressive quality reduction while converting to jpeg
    let quality = 90;
    const minQuality = 30;

    let out = await sharp(buffer).jpeg({ quality }).toBuffer();
    while (out.length > maxBytes && quality >= minQuality) {
      quality -= 10;
      out = await sharp(buffer).jpeg({ quality }).toBuffer();
    }

    if (out.length <= maxBytes) return out;

    // If still too large, reduce dimensions iteratively
    let meta = await sharp(buffer).metadata();
    let width = meta.width || 1024;
    const height = meta.height || null;
    let factor = 0.9;
    let current = out;
    for (let i = 0; i < 12 && current.length > maxBytes; i++) {
      width = Math.max(100, Math.floor(width * factor));
      current = await sharp(buffer)
        .resize(width, height ? null : undefined)
        .jpeg({ quality: Math.max(minQuality, quality) })
        .toBuffer();
      factor *= 0.9;
    }

    return current;
  }
}
