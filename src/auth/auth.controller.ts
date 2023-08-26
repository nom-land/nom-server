import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { SiweChallengeBody, SiweSigninBody } from './auth.dto';
import { JwtAuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/challenge')
  async getChallenge(
    @Body() body: SiweChallengeBody,
  ): Promise<{ message: string }> {
    const { address, domain, uri, statement } = body;
    const message = await this.authService.generateChallenge({
      address,
      domain,
      uri,
      statement,
    });
    return { message };
  }

  @Post('/signin')
  async signin(@Body() body: SiweSigninBody): Promise<{ token: string }> {
    const { message, signature } = body;
    const token = await this.authService.signin(message, signature);
    return { token };
  }

  @Get('/account')
  @UseGuards(JwtAuthGuard)
  async getMe(@Request() req: any) {
    return req.user;
  }
}
