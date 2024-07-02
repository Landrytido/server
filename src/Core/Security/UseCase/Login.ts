import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ContextualGraphqlRequest, UseCase } from '../../../index';
import RequestEventEmitter from '../../Event/Emitter/RequestEventEmitter';
import AuthenticationDto from '../Dto/AuthenticationDto';
import Authenticator from '../Service/authentication/Authenticator';

@Injectable()
export default class Login implements UseCase<Promise<string>, [dto: AuthenticationDto]> {
  constructor(
    @Inject('Authenticator') private authenticator: Authenticator,
    private readonly eventEmitter: RequestEventEmitter
  ) {}

  async handle(context: ContextualGraphqlRequest, dto: AuthenticationDto) {
    try {
      const user = await this.authenticator.authenticate(dto.email, dto.password);

      this.eventEmitter.emit('login_successfully', { context, email: dto.email });

      return this.authenticator.createToken(user);
    } catch (error) {
      this.eventEmitter.emit('login_failed', { context, email: dto.email, error: error.message });

      throw new BadRequestException(error.message);
    }
  }
}
