import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export default class Bcrypt implements Hashable {
  async hash(input) {
    return bcrypt.hash(input, 10);
  }

  async compare(input, hash) {
    return bcrypt.compare(input, hash);
  }
}
