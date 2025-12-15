import { Body, Controller, Get, Put, Req, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { JwtGuard } from "../auth/jwt.guard";
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { UpdateProfileDto } from "./dto/update-profile.dto";

@ApiTags("users")
@Controller("users")
export class UsersController {
  constructor(private users: UsersService) {}

  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @Get("me")
  @ApiOperation({ summary: "Get current user profile" })
  async me(@Req() req: any) {
    const id = req.user?.sub;
    return this.users.findById(id);
  }

  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @Put("me")
  @ApiOperation({ summary: "Update current user profile" })
  async updateMe(@Req() req: any, @Body() body: UpdateProfileDto) {
    const id = req.user?.sub;
    // allow updating name and password via service
    return this.users.updateProfile(id, body);
  }
}
