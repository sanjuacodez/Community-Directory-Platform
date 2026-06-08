import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';

interface R2UploadResult {
  key: string;
  size: string;
  etag: string;
  uploaded: string;
}

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);

  private get accountId(): string {
    return process.env['CLOUDFLARE_ACCOUNT_ID'] ?? '';
  }

  private get bucket(): string {
    return process.env['CLOUDFLARE_R2_BUCKET'] ?? 'community-directory';
  }

  private get token(): string {
    return process.env['CLOUDFLARE_R2_API_TOKEN'] ?? '';
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'uploads',
  ): Promise<{ key: string; url: string }> {
    const ext = file.originalname.split('.').pop() ?? 'bin';
    const key = `${folder}/${randomUUID()}.${ext}`;
    const contentType = file.mimetype || 'application/octet-stream';

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/r2/buckets/${this.bucket}/objects/${key}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': contentType,
        },
        body: new Uint8Array(file.buffer),
      },
    );

    if (!response.ok) {
      const error = await response.text();
      this.logger.error(`R2 upload failed: ${error}`);
      throw new Error(`Upload failed: ${response.status}`);
    }

    const result: R2UploadResult = (await response.json()).result;

    const publicUrl =
      process.env['CLOUDFLARE_R2_PUBLIC_URL'] ?? 'https://pub.r2.dev';
    const url = `${publicUrl}/${key}`;

    return {
      key: result.key,
      url,
    };
  }

  async getFile(key: string): Promise<{ data: ArrayBuffer; contentType: string }> {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/r2/buckets/${this.bucket}/objects/${key}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      },
    );

    if (!response.ok) {
      this.logger.error(`R2 download failed: ${response.status}`);
      throw new Error(`File not found: ${response.status}`);
    }

    const contentType = response.headers.get('content-type') ?? 'application/octet-stream';

    return {
      data: await response.arrayBuffer(),
      contentType,
    };
  }

  async deleteFile(key: string): Promise<void> {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/r2/buckets/${this.bucket}/objects/${key}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      },
    );

    if (!response.ok && response.status !== 404) {
      this.logger.error(`R2 delete failed: ${response.status}`);
    }
  }
}
