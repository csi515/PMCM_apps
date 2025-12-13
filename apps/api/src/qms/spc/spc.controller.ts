import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { SpcService } from './spc.service';
import { CreateSpcChartDto } from './dto/create-spc-chart.dto';

@Controller('qms/spc')
export class SpcController {
    constructor(private readonly spcService: SpcService) { }

    @Post('charts')
    createChart(@Body() dto: CreateSpcChartDto) {
        return this.spcService.createChart(dto);
    }

    @Get('charts')
    findAllCharts() {
        return this.spcService.findAllCharts();
    }

    @Get('charts/:id')
    findOneChart(@Param('id', ParseIntPipe) id: number) {
        return this.spcService.findOneChart(id);
    }

    @Post('charts/:id/data')
    addDataPoint(
        @Param('id', ParseIntPipe) id: number,
        @Body('value') value: number
    ) {
        return this.spcService.addDataPoint(id, value);
    }
}
