import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { StandardLibraryController } from './standard-library.controller';
import { StandardLibraryService } from './standard-library.service';

@Module({
    imports: [PrismaModule],
    controllers: [StandardLibraryController],
    providers: [StandardLibraryService],
})
export class StandardLibraryModule { }
