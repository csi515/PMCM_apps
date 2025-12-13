import { Controller, Get, Post, Body, Param, Put, ParseIntPipe } from '@nestjs/common';
import { QualityIssueService } from './quality-issue.service';
import { CreateQualityIssueDto } from './dto/create-quality-issue.dto';
import { UpdateQualityIssueDto } from './dto/update-quality-issue.dto';

@Controller('qms/quality-issues')
export class QualityIssueController {
    constructor(private readonly qualityIssueService: QualityIssueService) { }

    @Post()
    create(@Body() createDto: CreateQualityIssueDto) {
        return this.qualityIssueService.create(createDto);
    }

    @Get()
    findAll() {
        return this.qualityIssueService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.qualityIssueService.findOne(id);
    }

    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateQualityIssueDto) {
        return this.qualityIssueService.update(id, updateDto);
    }
}
