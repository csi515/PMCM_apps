import { Controller, Get, Query } from '@nestjs/common';
import { AuditService } from './audit.service';

@Controller('qms/audit')
export class AuditController {
    constructor(private readonly auditService: AuditService) { }

    @Get()
    getHistory(
        @Query('entityId') entityId: string,
        @Query('entityType') entityType: string
    ) {
        return this.auditService.getHistory(entityId, entityType);
    }
}
