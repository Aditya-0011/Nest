import {
  Controller,
  Post,
  Get,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

import { AuthGuard } from 'src/auth/auth.guard';

import { AwsService } from './aws.service';
import { Req } from 'types';

@Controller('file')
export class AwsController {
  constructor(private service: AwsService) {}

  @UseGuards(AuthGuard)
  @Get('all')
  FetchAll(@Request() req: Req) {
    return this.service.getAll(req.user.sub);
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload')
  Upload(@Request() req: Req, @UploadedFile() file: Express.Multer.File) {
    return this.service.upload(req.user.sub, file);
  }
}
