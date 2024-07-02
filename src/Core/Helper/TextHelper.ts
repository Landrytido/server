import { Injectable } from '@nestjs/common';

@Injectable()
export default class TextHelper {
  ucfirst(value: string): string {
    return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
  }
}
