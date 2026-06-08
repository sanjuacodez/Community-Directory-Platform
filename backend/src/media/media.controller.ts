import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Query,
  Res,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  NotFoundException,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin', 'family_admin')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder?: string,
  ) {
    if (!file) {
      throw new NotFoundException('No file provided');
    }

    const result = await this.mediaService.uploadFile(
      file,
      folder ?? 'uploads',
    );
    return result;
  }

  @Get('files/*')
  async serve(@Req() req: Request, @Res() res: Response) {
    const key = req.path.replace('/api/media/files/', '');
    try {
      const { data, contentType } = await this.mediaService.getFile(key);
      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=31536000');
      res.send(Buffer.from(data));
    } catch {
      throw new NotFoundException('File not found');
    }
  }

  @Delete('files/*')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin', 'family_admin')
  async remove(@Param('0') key: string) {
    await this.mediaService.deleteFile(key);
    return { message: 'File deleted' };
  }
}
