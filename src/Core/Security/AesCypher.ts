import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'node:crypto';

@Injectable()
export default class AesCypherService {
  constructor(private readonly config: ConfigService) {}

  encryptData(data: string): string {
    const key = crypto
      .createHash('sha512')
      .update(this.config.get('AES_SECRET_KEY'))
      .digest('hex')
      .substring(0, 32);
    const encryptionIV = crypto
      .createHash('sha512')
      .update(this.config.get('AES_IV'))
      .digest('hex')
      .substring(0, 16);
    const cipher = crypto.createCipheriv(
      this.config.get('AES_ENCRYPTION_METHOD'),
      key,
      encryptionIV
    );
    return Buffer.from(
      cipher.update(data, 'utf8', 'hex') + cipher.final('hex')
    ).toString('base64');
  }

  decryptData(encryptedData: string): string {
    const key = crypto
      .createHash('sha512')
      .update(this.config.get('AES_SECRET_KEY'))
      .digest('hex')
      .substring(0, 32);
    const encryptionIV = crypto
      .createHash('sha512')
      .update(this.config.get('AES_IV'))
      .digest('hex')
      .substring(0, 16);
    const buff = Buffer.from(encryptedData, 'base64');
    const decipher = crypto.createDecipheriv(
      this.config.get('AES_ENCRYPTION_METHOD'),
      key,
      encryptionIV
    );
    return (
      decipher.update(buff.toString('utf8'), 'hex', 'utf8') +
      decipher.final('utf8')
    );
  }
}
