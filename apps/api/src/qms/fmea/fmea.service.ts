import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFmeaDto } from './dto/create-fmea.dto';

@Injectable()
export class FmeaService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createDto: CreateFmeaDto) {
        return this.prisma.qmsFmea.create({
            data: {
                fmeaNo: createDto.fmeaNo,
                title: createDto.title,
                partName: createDto.partName,
                partNumber: createDto.partNumber,
                revision: createDto.revision || 'R0',
            },
        });
    }

    async findAll() {
        return this.prisma.qmsFmea.findMany({
            orderBy: { updatedAt: 'desc' },
            include: { items: true },
        });
    }

    async findOne(id: number) {
        return this.prisma.qmsFmea.findUnique({
            where: { id },
            include: { items: true },
        });
    }
}
