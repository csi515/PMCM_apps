import { Controller, Post, UseGuards, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { UserDto } from '../common/dto';

interface RequestWithUser extends Request {
  user: UserDto;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Req() req: RequestWithUser, @Res() res: Response) {
    const { access_token } = this.authService.login(req.user);

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
  logout(@Res() res: Response) {
    res.clearCookie('access_token', { path: '/' });
    return res.send({ message: 'Logout successful' });
  }
}
