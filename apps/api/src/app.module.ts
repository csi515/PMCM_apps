import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataModule } from './data/data.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { GtmModule } from './gtm/gtm.module';
import { VocModule } from './qms/voc/voc.module';
import { StandardLibraryModule } from './qms/standard-library/standard-library.module';
import { FmeaModule } from './qms/fmea/fmea.module';
import { PpapModule } from './qms/ppap/ppap.module';
import { QualityIssueModule } from './qms/quality-issue/quality-issue.module';
import { SpcModule } from './qms/spc/spc.module';
import { NotificationModule } from './qms/notification/notification.module';
import { AuditModule } from './qms/audit/audit.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DataModule,
    AuthModule,
    AdminModule,
    GtmModule,
    VocModule,
    StandardLibraryModule,
    FmeaModule,
    PpapModule,
    QualityIssueModule,
    SpcModule,
    NotificationModule,
    AuditModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
