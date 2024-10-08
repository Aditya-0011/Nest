import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Express } from 'express';

import { Files } from 'src/entities/file.entity';
import { Users } from 'src/entities/user.entity';

import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
  PutObjectCommandOutput,
} from '@aws-sdk/client-s3';

@Injectable()
export class AwsService {
  private readonly client: S3Client;
  private readonly region: string;
  private readonly bucket: string;
  constructor(
    private config: ConfigService,
    @InjectRepository(Files)
    private fileRepo: Repository<Files>,
    @InjectRepository(Users)
    private userRepo: Repository<Users>,
  ) {
    this.region = this.config.get<string>('S3_REGION');
    this.bucket = this.config.get<string>('S3_BUCKET');
    this.client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: this.config.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.config.get<string>('AWS_SECRET_ACCESS'),
      },
    });
  }

  private async AwsUpload(file: Express.Multer.File, key: string) {
    const input: PutObjectCommandInput = {
      Body: file.buffer,
      Bucket: this.bucket,
      Key: key,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };
    try {
      const response: PutObjectCommandOutput = await this.client.send(
        new PutObjectCommand(input),
      );
      if (response.$metadata.httpStatusCode === 200) {
        return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
      }
      throw new InternalServerErrorException('Upload failed');
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async upload(id: number, file: Express.Multer.File) {
    const user = await this.userRepo.findOneBy({ id });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const key = `${file.fieldname}-${Date.now()}`;
    try {
      const url = await this.AwsUpload(file, key);
      if (!url) {
        throw new InternalServerErrorException('Upload failed');
      }
      const newFile = this.fileRepo.create({ url, user });
      await this.fileRepo.save(newFile);
      return 'Upload successful';
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async getAll(id: number): Promise<{ data: Files[] }> {
    return {
      data: await this.fileRepo.find({ where: { user: { id } } }),
    };
  }
}
