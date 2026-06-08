import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { RelationshipsService } from './relationships.service';
import {
  CreateRelationshipDto,
  UpdateRelationshipDto,
} from './dto/relationship.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('relationships')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('super_admin', 'family_admin')
export class RelationshipsController {
  constructor(
    private readonly relationshipsService: RelationshipsService,
  ) {}

  @Post()
  create(@Body() dto: CreateRelationshipDto) {
    return this.relationshipsService.create(dto);
  }

  @Get('member/:memberId')
  findByMember(@Param('memberId') memberId: string) {
    return this.relationshipsService.findByMember(memberId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateRelationshipDto,
  ) {
    return this.relationshipsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.relationshipsService.remove(id);
  }
}
