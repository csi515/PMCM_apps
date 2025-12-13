import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePpapDto } from './dto/create-ppap.dto';

@Injectable()
export class PpapService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createPpapDto: CreatePpapDto) {
        return this.prisma.qmsPpap.create({
            data: {
                ...createPpapDto,
                status: createPpapDto.status || 'DRAFT',
            },
        });
    }

    async findAll() {
        return this.prisma.qmsPpap.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                documents: true,
            }
        });
    }

    async findOne(id: number) {
        return this.prisma.qmsPpap.findUnique({
            where: { id },
            include: {
                documents: true,
            },
        });
    }
}
