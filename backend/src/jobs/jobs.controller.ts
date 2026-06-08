import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto, UpdateJobDto } from './dto/job.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}
  @Post() @UseGuards(JwtAuthGuard, RolesGuard) @Roles('super_admin')
  create(@Body() dto: CreateJobDto) { return this.jobsService.create(dto); }
  @Get() findAll(@Query('communityId') c?: string) { return this.jobsService.findAll(c); }
  @Get(':id') findOne(@Param('id') id: string) { return this.jobsService.findOne(id); }
  @Patch(':id') @UseGuards(JwtAuthGuard, RolesGuard) @Roles('super_admin')
  update(@Param('id') id: string, @Body() dto: UpdateJobDto) { return this.jobsService.update(id, dto); }
  @Delete(':id') @UseGuards(JwtAuthGuard, RolesGuard) @Roles('super_admin')
  remove(@Param('id') id: string) { return this.jobsService.remove(id); }
}
