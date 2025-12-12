import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { GtmService } from './gtm.service';

@Controller('gtm')
export class GtmController {
  constructor(private readonly gtmService: GtmService) {}

  @Get('goals/tree')
  async getGoalsTree(@Query('year') year: string) {
    return this.gtmService.getGoalsTree(
      Number(year) || new Date().getFullYear(),
    );
  }

  @Post('projects')
  async createProject(@Body() data: any) {
    return this.gtmService.createProject(data);
  }

  @Get('projects/:id/gantt')
  async getProjectGantt(@Param('id') id: string) {
    return this.gtmService.getProjectGantt(id);
  }

  @Post('tasks')
  async createTask(@Body() data: any) {
    return this.gtmService.createTask(data);
  }

  @Post('reports/draft')
  async generateDraft(
    @Body() body: { userId: number; year: number; weekNumber: number },
  ) {
    return this.gtmService.generateWeeklyReportDraft(
      body.userId,
      body.year,
      body.weekNumber,
    );
  }
}
