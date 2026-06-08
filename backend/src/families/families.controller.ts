import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FamiliesService } from './families.service';
import { CreateFamilyDto, UpdateFamilyDto } from './dto/family.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('families')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FamiliesController {
  constructor(private readonly familiesService: FamiliesService) {}

  @Post()
  @Roles('super_admin', 'family_admin')
  create(@Body() dto: CreateFamilyDto) {
    return this.familiesService.create(dto);
  }

  @Get()
  @Roles('super_admin', 'family_admin')
  findAll(@Query('communityId') communityId?: string) {
    return this.familiesService.findAll(communityId);
  }

  @Get(':id')
  @Roles('super_admin', 'family_admin')
  findOne(@Param('id') id: string) {
    return this.familiesService.findOne(id);
  }

  @Patch(':id')
  @Roles('super_admin', 'family_admin')
  update(@Param('id') id: string, @Body() dto: UpdateFamilyDto) {
    return this.familiesService.update(id, dto);
  }

  @Delete(':id')
  @Roles('super_admin', 'family_admin')
  remove(@Param('id') id: string) {
    return this.familiesService.remove(id);
  }
}
