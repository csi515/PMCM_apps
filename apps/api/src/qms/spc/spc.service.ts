import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSpcChartDto } from './dto/create-spc-chart.dto';

@Injectable()
export class SpcService {
    constructor(private readonly prisma: PrismaService) { }

    async createChart(dto: CreateSpcChartDto) {
        return this.prisma.qmsSpcChart.create({
            data: dto
        });
    }

    async findAllCharts() {
        return this.prisma.qmsSpcChart.findMany({
            include: { dataPoints: true }
        });
    }

    async findOneChart(id: number) {
        return this.prisma.qmsSpcChart.findUnique({
            where: { id },
            include: { dataPoints: { orderBy: { measuredAt: 'asc' } } }
        });
    }

    async addDataPoint(chartId: number, value: number) {
        return this.prisma.qmsSpcData.create({
            data: {
                chartId,
                value
            }
        });
    }
}
