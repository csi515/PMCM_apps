import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from '@nestjs/passport';
// import { RolesGuard } from '../auth/roles.guard'; // TODO
// import { Roles } from '../auth/roles.decorator';

@Controller('admin')
// @UseGuards(AuthGuard('jwt'), RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('users/bulk')
  // @Roles('ADMIN')
  async bulkRegisterUsers(@Body() users: any[]) {
    if (!Array.isArray(users)) {
      throw new HttpException('Input must be an array', HttpStatus.BAD_REQUEST);
    }
    return this.adminService.bulkRegisterUsers(users);
  }
}
