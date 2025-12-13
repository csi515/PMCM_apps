import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { QualityIssueController } from './quality-issue.controller';
import { QualityIssueService } from './quality-issue.service';

@Module({
    imports: [PrismaModule],
    controllers: [QualityIssueController],
    providers: [QualityIssueService],
})
export class QualityIssueModule { }
