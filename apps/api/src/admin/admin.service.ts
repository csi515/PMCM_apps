import { Injectable } from '@nestjs/common';
import { DataService } from '../data/data.service';
import * as bcrypt from 'bcryptjs';
import { BulkRegisterUserDto, BulkRegisterResultDto } from '../common/dto';
import { Role } from '../data/types';

@Injectable()
export class AdminService {
  constructor(private dataService: DataService) {}

  async bulkRegisterUsers(
    users: BulkRegisterUserDto[],
  ): Promise<BulkRegisterResultDto> {
    const results: BulkRegisterResultDto = {
      success: 0,
      failed: 0,
      errors: [],
    };

    const usersToCreate: Array<{
      username: string;
      name: string;
      deptCode: string;
      birthDate: string;
      password: string;
      role: Role;
    }> = [];

    for (const user of users) {
      if (!user.username || !user.name || !user.birthDate) {
        results.failed++;
        results.errors.push(`Missing fields for user: ${JSON.stringify(user)}`);
        continue;
      }

      // Check existence
      const exists = await this.dataService.findUserByUsername(user.username);
      if (exists) {
        results.failed++;
        results.errors.push(`User ${user.username} already exists`);
        continue;
      }

      // Hash password (birthDate 6 chars)
      const hashedPassword = await bcrypt.hash(user.birthDate, 10);

      usersToCreate.push({
        username: user.username,
        name: user.name,
        deptCode: user.deptCode || 'UNKNOWN',
        birthDate: user.birthDate,
        password: hashedPassword,
        role: (user.role || 'USER') as Role,
      });
    }

    if (usersToCreate.length > 0) {
      const created = await this.dataService.createManyUsers(usersToCreate);
      results.success += created;
    }

    return results;
  }
}
