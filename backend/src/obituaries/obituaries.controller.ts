import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ObituariesService } from './obituaries.service';
import { CreateObituaryDto, UpdateObituaryDto } from './dto/obituary.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('obituaries')
export class ObituariesController {
  constructor(private readonly obituariesService: ObituariesService) {}
  @Post() @UseGuards(JwtAuthGuard, RolesGuard) @Roles('super_admin', 'family_admin')
  create(@Body() dto: CreateObituaryDto) { return this.obituariesService.create(dto); }
  @Get() findAll(@Query('communityId') c?: string) { return this.obituariesService.findAll(c); }
  @Get(':id') findOne(@Param('id') id: string) { return this.obituariesService.findOne(id); }
  @Patch(':id') @UseGuards(JwtAuthGuard, RolesGuard) @Roles('super_admin', 'family_admin')
  update(@Param('id') id: string, @Body() dto: UpdateObituaryDto) { return this.obituariesService.update(id, dto); }
  @Delete(':id') @UseGuards(JwtAuthGuard, RolesGuard) @Roles('super_admin')
  remove(@Param('id') id: string) { return this.obituariesService.remove(id); }
}
