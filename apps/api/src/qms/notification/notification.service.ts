import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationService {
    constructor(private readonly prisma: PrismaService) { }

    async create(dto: CreateNotificationDto) {
        return this.prisma.qmsNotification.create({
            data: dto
        });
    }

    async findByUser(userId: number) {
        return this.prisma.qmsNotification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
    }

    async markAsRead(id: number) {
        return this.prisma.qmsNotification.update({
            where: { id },
            data: { isRead: true }
        });
    }

    async markAllAsRead(userId: number) {
        return this.prisma.qmsNotification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true }
        });
    }
}
