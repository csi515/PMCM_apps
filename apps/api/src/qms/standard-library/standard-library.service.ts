import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateStandardLibraryItemDto } from './dto/create-standard-library-item.dto';

@Injectable()
export class StandardLibraryService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createDto: CreateStandardLibraryItemDto) {
        return this.prisma.qmsStandardLibrary.create({
            data: {
                category: createDto.category,
                code: createDto.code,
                name: createDto.name,
                description: createDto.description,
            },
        });
    }

    async findAll(category?: string) {
        const where = category ? { category } : {};
        return this.prisma.qmsStandardLibrary.findMany({
            where,
            orderBy: { code: 'asc' },
        });
    }
}
