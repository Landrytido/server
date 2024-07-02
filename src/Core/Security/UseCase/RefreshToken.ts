import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import UserRepository from '../../../Api/Repository/UserRepository';
import { ContextualGraphqlRequest, UseCase } from '../../../index';
import RequestEventEmitter from '../../Event/Emitter/RequestEventEmitter';
import Authenticator from '../Service/authentication/Authenticator';

@Injectable()
export default class RefreshToken implements UseCase<Promise<string>, []> {
  constructor(
    @Inject('Authenticator') private authenticator: Authenticator,
    private readonly userRepository: UserRepository,
    private readonly eventEmitter: RequestEventEmitter
  ) {}

  async handle(context: ContextualGraphqlRequest) {
    try {
      const token = await this.authenticator.createToken(await this.userRepository.findById(context.userId));

      this.eventEmitter.emit('validate_token_successfully', { context });

      return token;
    } catch (error) {
      this.eventEmitter.emit('validate_token_failed', { context, error: error.message });

      throw new BadRequestException(error.message);
    }
  }
}
