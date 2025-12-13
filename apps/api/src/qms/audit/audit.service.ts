import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuditService {
    constructor(private readonly prisma: PrismaService) { }

    async log(entityId: string, entityType: string, action: string, userId: number, details?: any) {
        return this.prisma.qmsAuditLog.create({
            data: {
                entityId,
                entityType,
                action,
                userId,
                details: details || {}
            }
        });
    }

    async getHistory(entityId: string, entityType: string) {
        return this.prisma.qmsAuditLog.findMany({
            where: { entityId, entityType },
            orderBy: { createdAt: 'desc' }
        });
    }
}
