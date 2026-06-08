import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CommunitiesModule } from './communities/communities.module';
import { FamiliesModule } from './families/families.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    CommunitiesModule,
    FamiliesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
