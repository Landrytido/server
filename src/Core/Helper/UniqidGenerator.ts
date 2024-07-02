import { Injectable } from '@nestjs/common';
import * as uniqid from 'uniqid';

@Injectable()
export default class UniqidGenerator {
  generate(prefix?: string, suffix?: string) {
    return uniqid(prefix, suffix);
  }
}
