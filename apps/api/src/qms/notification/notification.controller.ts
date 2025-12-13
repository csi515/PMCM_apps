import { Controller, Get, Post, Body, Param, ParseIntPipe, Query } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Controller('qms/notifications')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) { }

    @Post()
    create(@Body() dto: CreateNotificationDto) {
        return this.notificationService.create(dto);
    }

    @Get()
    findByUser(@Query('userId', ParseIntPipe) userId: number) {
        return this.notificationService.findByUser(userId);
    }

    @Post(':id/read')
    markAsRead(@Param('id', ParseIntPipe) id: number) {
        return this.notificationService.markAsRead(id);
    }

    @Post('read-all')
    markAllAsRead(@Body('userId', ParseIntPipe) userId: number) {
        return this.notificationService.markAllAsRead(userId);
    }
}
