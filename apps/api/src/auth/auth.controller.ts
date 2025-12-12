import { Controller, Post, UseGuards, Request, Response } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req, @Response() res) {
    const { access_token } = await this.authService.login(req.user);

    // Cookie Setting as per requirements
    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/', // SSO Strategy
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return res.send({ message: 'Login successful' });
  }

  @Post('logout')
  async logout(@Response() res) {
    res.clearCookie('access_token', { path: '/' });
    return res.send({ message: 'Logout successful' });
  }
}
