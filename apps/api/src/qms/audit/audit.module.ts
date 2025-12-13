import { Module, Global } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuditService } from './audit.service';
import { AuditController } from './audit.controller';

@Global() // Make audit logging available everywhere
@Module({
    imports: [PrismaModule],
    controllers: [AuditController],
    providers: [AuditService],
    exports: [AuditService],
})
export class AuditModule { }
