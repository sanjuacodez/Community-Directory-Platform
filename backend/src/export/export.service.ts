import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExportService {
  constructor(private readonly prisma: PrismaService) {}

  async exportMembersCSV(): Promise<string> {
    const members = await this.prisma.member.findMany({
      where: { status: { not: 'deleted' } },
      include: { family: { select: { name: true } }, community: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });

    const headers = ['First Name','Last Name','Gender','DOB','Blood Group','Email','Phone','Profession','Organization','Education','Location','Family','Community'].join(',');
    const rows = members.map((m) =>
      [m.firstName,m.lastName,m.gender,m.dateOfBirth?.toISOString().split('T')[0]??'',m.bloodGroup??'',m.email??'',m.phone??'',m.profession??'',m.organization??'',m.education??'',m.location??'',m.family.name,m.community.name]
        .map((v) => `"${v.replace(/"/g, '""')}"`)
        .join(','),
    );

    return [headers, ...rows].join('\n');
  }

  async exportFamiliesCSV(): Promise<string> {
    const families = await this.prisma.family.findMany({
      where: { status: { not: 'deleted' } },
      include: { community: { select: { name: true } }, _count: { select: { members: true } } },
      orderBy: { createdAt: 'desc' },
    });

    const headers = ['Name','House Name','Address','Community','Members'].join(',');
    const rows = families.map((f) =>
      [f.name,f.houseName??'',f.address??'',f.community.name,f._count.members]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(','),
    );

    return [headers, ...rows].join('\n');
  }

  async importMembers(data: Array<Record<string, string>>, communityId: string, familyId: string): Promise<{ imported: number; errors: string[] }> {
    const errors: string[] = [];
    let imported = 0;

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      try {
        await this.prisma.member.create({
          data: {
            communityId,
            familyId,
            firstName: row['firstName'] ?? row['First Name'] ?? '',
            lastName: row['lastName'] ?? row['Last Name'] ?? '',
            gender: (row['gender'] ?? row['Gender'] ?? 'other') as any,
            bloodGroup: row['bloodGroup'] ?? row['Blood Group'] ?? null,
            email: row['email'] ?? row['Email'] ?? null,
            phone: row['phone'] ?? row['Phone'] ?? null,
            profession: row['profession'] ?? row['Profession'] ?? null,
            location: row['location'] ?? row['Location'] ?? null,
          },
        });
        imported++;
      } catch (err) {
        errors.push(`Row ${i + 1}: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }

    return { imported, errors };
  }
}
