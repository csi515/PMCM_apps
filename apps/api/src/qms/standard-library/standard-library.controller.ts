import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { StandardLibraryService } from './standard-library.service';
import { CreateStandardLibraryItemDto } from './dto/create-standard-library-item.dto';

@Controller('qms/standard-library')
export class StandardLibraryController {
    constructor(private readonly service: StandardLibraryService) { }

    @Post()
    create(@Body() createDto: CreateStandardLibraryItemDto) {
        return this.service.create(createDto);
    }

    @Get()
    findAll(@Query('category') category?: string) {
        return this.service.findAll(category);
    }
}
