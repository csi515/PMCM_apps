import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DataService } from '../data/data.service';
import * as bcrypt from 'bcryptjs';
import { UserDto, JwtPayload, LoginResponseDto } from '../common/dto';

@Injectable()
export class AuthService {
  constructor(
    private dataService: DataService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<UserDto | null> {
    const user = await this.dataService.findUserByUsername(username);
    if (user && (await bcrypt.compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result as UserDto;
    }
    return null;
  }

  login(user: UserDto): LoginResponseDto {
    const payload: JwtPayload = {
      username: user.username,
      sub: user.id,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
