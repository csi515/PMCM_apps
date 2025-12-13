import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { FmeaService } from './fmea.service';
import { CreateFmeaDto } from './dto/create-fmea.dto';

@Controller('qms/fmea')
export class FmeaController {
    constructor(private readonly service: FmeaService) { }

    @Post()
    create(@Body() createDto: CreateFmeaDto) {
        return this.service.create(createDto);
    }

    @Get()
    findAll() {
        return this.service.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.service.findOne(id);
    }
}
