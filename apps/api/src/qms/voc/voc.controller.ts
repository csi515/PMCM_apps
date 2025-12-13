import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { VocService } from './voc.service';
import { CreateVocDto } from './dto/create-voc.dto';

@Controller('voc')
export class VocController {
    constructor(private readonly vocService: VocService) { }

    @Post()
    create(@Body() createVocDto: CreateVocDto) {
        return this.vocService.create(createVocDto);
    }

    @Get()
    findAll() {
        return this.vocService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.vocService.findOne(+id);
    }

    // @Put(':id')
    // update(@Param('id') id: string, @Body() updateVocDto: UpdateVocDto) {
    //   return this.vocService.update(+id, updateVocDto);
    // }

    // @Delete(':id')
    // remove(@Param('id') id: string) {
    //   return this.vocService.remove(+id);
    // }
}
