import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard() {
    const [members, families, communities, announcements, events, businesses, jobs, obituaries] = await Promise.all([
      this.prisma.member.count({ where: { status: { not: 'deleted' } } }),
      this.prisma.family.count({ where: { status: { not: 'deleted' } } }),
      this.prisma.community.count({ where: { status: { not: 'deleted' } } }),
      this.prisma.announcement.count({ where: { status: { not: 'deleted' } } }),
      this.prisma.event.count(),
      this.prisma.business.count(),
      this.prisma.job.count(),
      this.prisma.obituary.count(),
    ]);

    return {
      members,
      families,
      communities,
      announcements,
      events,
      businesses,
      jobs,
      obituaries,
    };
  }

  async getBloodGroupStats() {
    const result = await this.prisma.member.groupBy({
      by: ['bloodGroup'],
      _count: true,
      where: { status: { not: 'deleted' }, bloodGroup: { not: null } },
      orderBy: { _count: { bloodGroup: 'desc' } },
    });

    return result.map((r) => ({
      bloodGroup: r.bloodGroup,
      count: r._count,
    }));
  }

  async getProfessionStats() {
    const result = await this.prisma.member.groupBy({
      by: ['profession'],
      _count: true,
      where: { status: { not: 'deleted' }, profession: { not: null } },
      orderBy: { _count: { profession: 'desc' } },
      take: 20,
    });

    return result.map((r) => ({
      profession: r.profession,
      count: r._count,
    }));
  }

  async getMemberDistribution() {
    const byCommunity = await this.prisma.member.groupBy({
      by: ['communityId'],
      _count: true,
      where: { status: { not: 'deleted' } },
    });

    const communities = await this.prisma.community.findMany({
      where: { id: { in: byCommunity.map((c) => c.communityId) } },
      select: { id: true, name: true },
    });

    return byCommunity.map((c) => ({
      communityId: c.communityId,
      communityName: communities.find((cm) => cm.id === c.communityId)?.name ?? 'Unknown',
      count: c._count,
    }));
  }
}
