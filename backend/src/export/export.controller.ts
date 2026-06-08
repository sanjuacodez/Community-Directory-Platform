import { Controller, Get, Post, Res, Body, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { ExportService } from './export.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('export')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('super_admin')
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Get('members/csv')
  async exportMembers(@Res() res: Response) {
    const csv = await this.exportService.exportMembersCSV();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=members.csv');
    res.send(csv);
  }

  @Get('families/csv')
  async exportFamilies(@Res() res: Response) {
    const csv = await this.exportService.exportFamiliesCSV();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=families.csv');
    res.send(csv);
  }

  @Post('members/import')
  async importMembers(
    @Body() body: { communityId: string; familyId: string; data: Array<Record<string, string>> },
  ) {
    return this.exportService.importMembers(body.data, body.communityId, body.familyId);
  }
}
