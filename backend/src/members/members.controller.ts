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
import { MembersService } from './members.service';
import { CreateMemberDto, UpdateMemberDto } from './dto/member.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('members')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post()
  @Roles('super_admin', 'family_admin')
  create(@Body() dto: CreateMemberDto) {
    return this.membersService.create(dto);
  }

  @Get()
  @Roles('super_admin', 'family_admin', 'member')
  findAll(
    @Query('communityId') communityId?: string,
    @Query('familyId') familyId?: string,
    @Query('search') search?: string,
    @Query('bloodGroup') bloodGroup?: string,
    @Query('profession') profession?: string,
    @Query('location') location?: string,
  ) {
    return this.membersService.findAll({
      communityId,
      familyId,
      search,
      bloodGroup,
      profession,
      location,
    });
  }

  @Get(':id')
  @Roles('super_admin', 'family_admin', 'member')
  findOne(@Param('id') id: string) {
    return this.membersService.findOne(id);
  }

  @Patch(':id')
  @Roles('super_admin', 'family_admin')
  update(@Param('id') id: string, @Body() dto: UpdateMemberDto) {
    return this.membersService.update(id, dto);
  }

  @Delete(':id')
  @Roles('super_admin', 'family_admin')
  remove(@Param('id') id: string) {
    return this.membersService.remove(id);
  }
}
