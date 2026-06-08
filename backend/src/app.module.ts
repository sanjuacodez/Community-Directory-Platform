import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CommunitiesModule } from './communities/communities.module';
import { FamiliesModule } from './families/families.module';
import { MembersModule } from './members/members.module';
import { MediaModule } from './media/media.module';
import { RelationshipsModule } from './relationships/relationships.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { EventsModule } from './events/events.module';
import { BusinessesModule } from './businesses/businesses.module';
import { JobsModule } from './jobs/jobs.module';
import { ObituariesModule } from './obituaries/obituaries.module';
import { ReportsModule } from './reports/reports.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    CommunitiesModule,
    FamiliesModule,
    MembersModule,
    MediaModule,
    RelationshipsModule,
    AnnouncementsModule,
    EventsModule,
    BusinessesModule,
    JobsModule,
    ObituariesModule,
    ReportsModule,
    AuditLogsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
