import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtGuard implements CanActivate {
  private jwt: JwtService;
  constructor() {
    // create a JwtService instance using the same secret from env
    this.jwt = new JwtService({
      secret: process.env.JWT_SECRET || "secret",
    } as any);
  }

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const auth = req.headers["authorization"] || req.headers["Authorization"];
    if (!auth) return false;
    const parts = auth.split(" ");
    if (parts.length !== 2) return false;
    const token = parts[1];
    try {
      const payload = this.jwt.verify(token);
      req.user = payload;
      return true;
    } catch (e) {
      return false;
    }
  }
}
