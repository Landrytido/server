import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import AuthenticationEventEmitter, { AuthenticationEvents } from '../Event/AuthenticationEventEmitter';
import Authenticator from '../Service/authentication/Authenticator';

@Injectable()
export default class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('Authenticator') private authenticator: Authenticator,
    private readonly eventEmitter: AuthenticationEventEmitter
  ) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    try {
      const user = await this.authenticator.authenticate(email, password);

      this.eventEmitter.emit(AuthenticationEvents.SUCCESSFULLY_AUTHENTICATED, {
        userId: user.id
      });

      return user;
    } catch (error) {
      this.eventEmitter.emit(AuthenticationEvents.ERROR, {
        message: error.message
      });
      throw new UnauthorizedException();
    }
  }
}
