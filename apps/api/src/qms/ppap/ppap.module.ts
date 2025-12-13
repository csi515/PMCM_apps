import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { PpapController } from './ppap.controller';
import { PpapService } from './ppap.service';

@Module({
    imports: [PrismaModule],
    controllers: [PpapController],
    providers: [PpapService],
})
export class PpapModule { }
