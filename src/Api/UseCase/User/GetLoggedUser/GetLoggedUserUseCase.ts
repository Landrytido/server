import { BadRequestException, Injectable, UseGuards } from '@nestjs/common';
import RequestEventEmitter from '../../../../Core/Event/Emitter/RequestEventEmitter';
import GraphqlAuthGuard from '../../../../Core/Security/Guard/GraphqlAuthGuard';
import { ContextualGraphqlRequest, UseCase } from '../../../../index';
import User from '../../../Entity/User';
import UserRepository from '../../../Repository/UserRepository';

@Injectable()
export default class GetLoggedUserUseCase implements UseCase<Promise<User>, []> {
  constructor(
    private readonly repository: UserRepository,
    private readonly eventEmitter: RequestEventEmitter
  ) {}

  @UseGuards(GraphqlAuthGuard)
  async handle(context: ContextualGraphqlRequest): Promise<User> {
    try {
      return { ...(await this.repository.findById(context.userId)), context };
    } catch (error) {
      this.eventEmitter.emit('get_logged_user_failed', { context, error: error.message });

      throw new BadRequestException(error.message);
    }
  }
}
