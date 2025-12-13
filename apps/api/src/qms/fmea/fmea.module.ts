import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { FmeaController } from './fmea.controller';
import { FmeaService } from './fmea.service';

@Module({
    imports: [PrismaModule],
    controllers: [FmeaController],
    providers: [FmeaService],
})
export class FmeaModule { }
