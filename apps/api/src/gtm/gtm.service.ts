import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GtmService {
  constructor(private prisma: PrismaService) {}

  // 1. Goal Alignment (Tree View)
  async getGoalsTree(year: number) {
    // Top-down: Goal -> Projects -> Tasks
    const goals = await this.prisma.gtmStrategicGoal.findMany({
      where: { year, isDeleted: false },
      include: {
        projects: {
          where: { isDeleted: false },
          include: {
            tasks: {
              where: { isDeleted: false, parentTaskId: null }, // Only root tasks
            },
          },
        },
      },
    });
    return goals;
  }

  // 2. Project Management
  async createProject(data: any) {
    const { deptId, goalId, projectName, startDate, endDate, description } =
      data;

    return this.prisma.gtmProject.create({
      data: {
        deptId,
        goalId,
        projectName,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        baselineStart: new Date(startDate), // Initial Plan Snapshot
        baselineEnd: new Date(endDate), // Initial Plan Snapshot
        status: 'PLANNED',
      },
    });
  }

  async getProjectGantt(projectId: string) {
    const project = await this.prisma.gtmProject.findUnique({
      where: { id: projectId },
      include: {
        tasks: {
          where: { isDeleted: false },
          orderBy: { startDate: 'asc' },
        },
      },
    });

    // Transform for dhtmlx-gantt if needed, or return raw
    return project;
  }

  // 3. Task Management
  async createTask(data: any) {
    const {
      projectId,
      taskName,
      startDate,
      endDate,
      assigneeId,
      parentTaskId,
      dependencyIds,
    } = data;
    const project = await this.prisma.gtmProject.findUnique({
      where: { id: projectId },
    });

    return this.prisma.gtmTask.create({
      data: {
        projectId,
        deptId: project?.deptId || 'UNKNOWN',
        taskName,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        assigneeId,
        parentTaskId,
        dependencyIds: dependencyIds || [], // JSON array
        status: 'READY',
      },
    });
  }

  async updateTaskStatus(taskId: string, status: string, progress: number) {
    return this.prisma.gtmTask.update({
      where: { id: taskId },
      data: { status, progress },
    });
  }

  // 4. Weekly Report (Smart Draft)
  async generateWeeklyReportDraft(
    userId: number,
    year: number,
    weekNumber: number,
  ) {
    // Find tasks completed or in-progress by this user recently (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const tasks = await this.prisma.gtmTask.findMany({
      where: {
        assigneeId: userId,
        updatedAt: {
          gte: sevenDaysAgo,
        },
      },
    });

    const doneTasks = tasks.filter((t) => t.status === 'DONE');
    const inProgressTasks = tasks.filter((t) => t.status === 'IN_PROGRESS');

    const achievements =
      doneTasks.map((t) => `- [Completed] ${t.taskName}`).join('\n') +
      '\n' +
      inProgressTasks
        .map((t) => `- [In Progress] ${t.taskName} (${t.progress}%)`)
        .join('\n');

    // Find tasks starting next week
    const nextWeekStart = new Date();
    nextWeekStart.setDate(nextWeekStart.getDate() + 7);

    const plannedTasks = await this.prisma.gtmTask.findMany({
      where: {
        assigneeId: userId,
        startDate: {
          gte: new Date(),
          lte: nextWeekStart,
        },
      },
    });

    const plans = plannedTasks
      .map(
        (t) =>
          `- [Planned] ${t.taskName} (Due: ${t.endDate.toISOString().split('T')[0]})`,
      )
      .join('\n');

    return {
      userId,
      year,
      weekNumber,
      achievements,
      plans,
      issues: '', // To be filled by user
      status: 'DRAFT',
    };
  }
}
