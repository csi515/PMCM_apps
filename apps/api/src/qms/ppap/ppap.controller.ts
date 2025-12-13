import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { PpapService } from './ppap.service';
import { CreatePpapDto } from './dto/create-ppap.dto';

@Controller('qms/ppap')
export class PpapController {
    constructor(private readonly ppapService: PpapService) { }

    @Post()
    create(@Body() createPpapDto: CreatePpapDto) {
        return this.ppapService.create(createPpapDto);
    }

    @Get()
    findAll() {
        return this.ppapService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.ppapService.findOne(id);
    }
}
