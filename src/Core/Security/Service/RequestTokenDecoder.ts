import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export default class RequestTokenDecoder {
  constructor(private readonly jwt: JwtService) {}

  decodeTokenFromRequest(request: Request) {
    if (!('authorization' in request.headers)) {
      throw new Error(
        'Authorization must be available in the given request headers.',
      );
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.jwt.decode(
      request.headers.get('authorization').replace('Bearer ', ''),
    );
  }
}
