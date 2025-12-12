import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async bulkRegisterUsers(users: any[]) {
    const results = {
      success: 0,
      failed: 0,
      errors: [],
    };

    // Transaction? Or process one by one to report errors?
    // Requirement says: "중복된 사번이 있을 경우 해당 건은 스킵하거나 에러 리포트 반환"
    // Using transaction for all or nothing might be too strict if one fails.
    // Let's try individual for feedback or bulkMany for performance if no validation needed contextually.
    // But we need to hash passwords. createMany doesn't support custom logic per row easily in one go unless pre-processed.

    // 1. Pre-process to hash passwords
    const usersToCreate = [];

    for (const user of users) {
      if (!user.username || !user.name || !user.birthDate) {
        results.failed++;
        results.errors.push(`Missing fields for user: ${JSON.stringify(user)}`);
        continue;
      }

      // Check existence
      const exists = await this.prisma.user.findUnique({
        where: { username: user.username },
      });
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
        role: user.role || 'USER',
      });
    }

    if (usersToCreate.length > 0) {
      await this.prisma.user.createMany({
        data: usersToCreate,
        skipDuplicates: true, // Safety net
      });
      results.success += usersToCreate.length;
    }

    return results;
  }
}
