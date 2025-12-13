import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { SpcController } from './spc.controller';
import { SpcService } from './spc.service';

@Module({
    imports: [PrismaModule],
    controllers: [SpcController],
    providers: [SpcService],
})
export class SpcModule { }
