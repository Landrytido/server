import { Injectable } from '@nestjs/common';

@Injectable()
export default class DateFactory {
  create(date?: number | string | Date): Date {
    return date ? new Date(date) : new Date();
  }
}
