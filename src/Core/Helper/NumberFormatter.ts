import { Injectable } from '@nestjs/common';

@Injectable()
export default class NumberFormatter {
  formatNumber(number: number, locales: string|string[] = 'be-BE') {
    return new Intl.NumberFormat(locales).format(number);
  }

  formatDevise(number: number, devise: string, locales: string|string[] = 'be-BE') {
    return `${new Intl.NumberFormat(locales).format(number)}${devise}`;
  }

  roundDevise(number: number) {
    return Math.round((number + Number.EPSILON) * 100) / 100;
  }
}
