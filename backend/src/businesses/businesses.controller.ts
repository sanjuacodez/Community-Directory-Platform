import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { BusinessesService } from './businesses.service';
import { CreateBusinessDto, UpdateBusinessDto } from './dto/business.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('businesses')
export class BusinessesController {
  constructor(private readonly businessesService: BusinessesService) {}
  @Post() @UseGuards(JwtAuthGuard, RolesGuard) @Roles('super_admin', 'family_admin')
  create(@Body() dto: CreateBusinessDto) { return this.businessesService.create(dto); }
  @Get()
  findAll(@Query('communityId') c?: string, @Query('category') cat?: string) { return this.businessesService.findAll(c, cat); }
  @Get(':id')
  findOne(@Param('id') id: string) { return this.businessesService.findOne(id); }
  @Patch(':id') @UseGuards(JwtAuthGuard, RolesGuard) @Roles('super_admin', 'family_admin')
  update(@Param('id') id: string, @Body() dto: UpdateBusinessDto) { return this.businessesService.update(id, dto); }
  @Delete(':id') @UseGuards(JwtAuthGuard, RolesGuard) @Roles('super_admin')
  remove(@Param('id') id: string) { return this.businessesService.remove(id); }
}
