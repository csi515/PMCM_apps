import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateQualityIssueDto } from './dto/create-quality-issue.dto';
import { UpdateQualityIssueDto } from './dto/update-quality-issue.dto';

@Injectable()
export class QualityIssueService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createDto: CreateQualityIssueDto) {
        return this.prisma.qmsQualityIssue.create({
            data: {
                ...createDto,
                status: createDto.status || 'OPEN',
                processStep: createDto.processStep || 'D0',
            },
        });
    }

    async findAll() {
        return this.prisma.qmsQualityIssue.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                voc: true, // Include related VOC if any
            }
        });
    }

    async findOne(id: number) {
        return this.prisma.qmsQualityIssue.findUnique({
            where: { id },
            include: {
                voc: true,
            },
        });
    }

    async update(id: number, updateDto: UpdateQualityIssueDto) {
        return this.prisma.qmsQualityIssue.update({
            where: { id },
            data: updateDto,
        });
    }
}
