import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateVocDto } from './dto/create-voc.dto';

@Injectable()
export class VocService {
    constructor(private prisma: PrismaService) { }

    async create(createVocDto: CreateVocDto) {
        // Auto-generate VOC Number: VOC-YYYY-MM-NNN
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');

        // Find last VOC of this month to increment
        const lastVoc = await this.prisma.qmsVoc.findFirst({
            where: {
                vocNo: {
                    startsWith: `VOC-${year}-${month}`
                }
            },
            orderBy: {
                vocNo: 'desc'
            }
        });

        let nextNum = 1;
        if (lastVoc) {
            const parts = lastVoc.vocNo.split('-');
            const lastNum = parseInt(parts[3], 10);
            if (!isNaN(lastNum)) {
                nextNum = lastNum + 1;
            }
        }

        const vocNo = `VOC-${year}-${month}-${String(nextNum).padStart(3, '0')}`;

        return this.prisma.qmsVoc.create({
            data: {
                ...createVocDto,
                vocNo,
                status: createVocDto.status || 'RECEIVED',
            },
        });
    }

    findAll() {
        return this.prisma.qmsVoc.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                qualityIssues: true // Include related 8D
            }
        });
    }

    findOne(id: number) {
        return this.prisma.qmsVoc.findUnique({
            where: { id },
            include: {
                qualityIssues: true
            }
        });
    }
}
