import { Module } from '@nestjs/common';
import { VocService } from './voc.service';
import { VocController } from './voc.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [VocController],
    providers: [VocService],
})
export class VocModule { }
