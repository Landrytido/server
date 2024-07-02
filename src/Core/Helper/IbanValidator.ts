import { Injectable } from '@nestjs/common';

@Injectable()
export default class IbanValidator {
  private countryLengths = {
    AD: 24,
    AE: 23,
    AL: 28,
    AT: 20,
    AZ: 28,
    BA: 20,
    BE: 16,
    BG: 22,
    BH: 22,
    BI: 28,
    BR: 29,
    BY: 28,
    CH: 21,
    CR: 22,
    CY: 28,
    CZ: 24,
    DE: 22,
    DK: 18,
    DO: 28,
    EE: 20,
    EG: 29,
    ES: 24,
    LC: 32,
    FI: 18,
    FO: 18,
    FR: 27,
    GB: 22,
    GE: 22,
    GI: 23,
    GL: 18,
    GR: 27,
    GT: 28,
    HR: 21,
    HU: 28,
    IE: 22,
    IL: 23,
    IQ: 23,
    IS: 26,
    IT: 27,
    JO: 30,
    KW: 30,
    KZ: 20,
    LB: 28,
    LI: 21,
    LT: 20,
    LU: 20,
    LV: 21,
    LY: 25,
    MC: 27,
    MD: 24,
    ME: 22,
    MK: 19,
    MR: 27,
    MT: 31,
    MU: 30,
    NL: 18,
    NO: 15,
    PK: 24,
    PL: 28,
    PS: 29,
    PT: 25,
    QA: 29,
    RO: 24,
    RS: 22,
    SA: 24,
    SC: 31,
    SD: 18,
    SE: 24,
    SI: 19,
    SK: 24,
    SM: 27,
    ST: 25,
    SV: 28,
    TL: 23,
    TN: 24,
    TR: 26,
    UA: 29,
    VA: 22,
    VG: 24,
    XK: 20
  };

  validate(input: string) {
    const iban = input.toUpperCase().replace(/ /g, '');
    const countryCode: any = iban.slice(0, 2) as any;

    if (!Object.keys(this.countryLengths).includes(countryCode)) {
      return false;
    }

    if (this.countryLengths[countryCode] !== iban.length) {
      return false;
    }

    const ibanMovedInitials = `${iban.slice(4)}${iban.slice(0, 4)}`;
    const lettersRegex = /[A-Z]/g;
    const onlyDigits = ibanMovedInitials.replace(lettersRegex, (match) => this.letterToTwoDigits(match));

    return this.mod97(onlyDigits) === 1;
  }

  private mod97(numStr: string) {
    let checksum = Number(numStr.slice(0, 2));
    let fragment = '';

    for (let offset = 2; offset < numStr.length; offset += 7) {
      fragment = checksum + numStr.substring(offset, offset + 7);
      checksum = parseInt(fragment, 10) % 97;
    }

    return checksum;
  }

  private letterToTwoDigits(letter: string) {
    return String(letter.charCodeAt(0) - 55);
  }
}
