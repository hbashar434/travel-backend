import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("register")
  @ApiOperation({ summary: "Register a new user" })
  @ApiResponse({
    status: 201,
    description: "User registered with access token",
  })
  async register(@Body() body: RegisterDto) {
    const { email, password, name } = body;
    return this.authService.register(email, password, name);
  }

  @Post("login")
  @ApiOperation({ summary: "Login with email and password" })
  @ApiResponse({ status: 200, description: "Returns access token" })
  async login(@Body() body: LoginDto) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      return { error: "Invalid credentials" };
    }
    return this.authService.login(user);
  }
}
