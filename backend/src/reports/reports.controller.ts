import { Controller, Get, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('super_admin')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('dashboard')
  getDashboard() { return this.reportsService.getDashboard(); }

  @Get('member-distribution')
  getMemberDistribution() { return this.reportsService.getMemberDistribution(); }

  @Get('blood-groups')
  getBloodGroups() { return this.reportsService.getBloodGroupStats(); }

  @Get('professions')
  getProfessions() { return this.reportsService.getProfessionStats(); }
}
