// src/Api/UseCase/Link/Service/s3-upload.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { promises as fs } from 'fs';
import * as path from 'path';
import * as url from 'url';

@Injectable()
export class S3UploadService {
    private readonly logger = new Logger(S3UploadService.name);
    private readonly s3Client: S3Client;
    private readonly bucketName: string;
    private readonly prefix: string;

    constructor() {
	  const publicUrl = process.env.CDN_PUBLIC_URL || '';
	  if (!publicUrl) {
		throw new Error('CDN_PUBLIC_URL est requis dans le .env');
	  }

	  const parsed = new url.URL(publicUrl);
	  const domainParts = parsed.host.split('.');
	  this.bucketName = domainParts[0];
	  this.prefix = parsed.pathname.replace(/^\/+/, '');

	  const endpointHost = domainParts.slice(1).join('.');
	  const endpointUrl = `https://${endpointHost}`;

	  this.s3Client = new S3Client({
		credentials: {
		    accessKeyId: process.env.CDN_ACCESS_KEY_ID || '',
		    secretAccessKey: process.env.CDN_ACCESS_KEY || '',
		},
		endpoint: endpointUrl,
		forcePathStyle: false,
		region: 'fr-par',
	  });

	  this.logger.debug(`S3UploadService: Bucket = ${this.bucketName}, Prefix = ${this.prefix}, Endpoint = ${endpointUrl}`);
    }

    public async uploadFile(localFilePath: string, filename: string): Promise<string> {
	  try {
		const fileBuffer = await fs.readFile(localFilePath);
		const objectKey = this.prefix
			? `${this.prefix}/${filename}`
			: filename;

		const putCommand = new PutObjectCommand({
		    Bucket: this.bucketName,
		    Key: objectKey,
		    Body: fileBuffer,
		    ACL: 'public-read',
		    ContentType: 'image/png',
		});

		const result = await this.s3Client.send(putCommand);
		this.logger.log(`Fichier uploadé. ETag: ${result.ETag}`);

		const uploadedUrl = `${process.env.CDN_PUBLIC_URL}/${objectKey}`; // Inclure objectKey

		return uploadedUrl;
	  } catch (error) {
		this.logger.error('Erreur lors de l\'upload S3', error);
		throw error;
	  }
    }

    public async deleteFile(fileKey: string): Promise<void> {
	  try {
		const deleteCommand = new DeleteObjectCommand({
		    Bucket: this.bucketName,
		    Key: this.prefix ? `${this.prefix}/${fileKey}` : fileKey,
		});

		await this.s3Client.send(deleteCommand);
		this.logger.log(`Fichier supprimé de S3 : ${fileKey}`);
	  } catch (error) {
		this.logger.error('Erreur lors de la suppression S3', error);
		throw error;
	  }
    }
}