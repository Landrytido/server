import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ContextualGraphqlRequest, UseCase } from '../../../index';
import RequestEventEmitter from '../../Event/Emitter/RequestEventEmitter';
import TokenValidationDto from '../Dto/TokenValidationDto';
import Authenticator from '../Service/authentication/Authenticator';

@Injectable()
export default class ValidateToken implements UseCase<Promise<boolean>, [dto: TokenValidationDto]> {
  constructor(
    @Inject('Authenticator') private authenticator: Authenticator,
    private readonly eventEmitter: RequestEventEmitter
  ) {}

  async handle(context: ContextualGraphqlRequest, dto: TokenValidationDto) {
    try {
      await this.authenticator.validate(dto.token);

      this.eventEmitter.emit('validate_token_successfully', { context, dto });

      return true;
    } catch (error) {
      this.eventEmitter.emit('validate_token_failed', { context, dto, error: error.message });

      throw new BadRequestException(error.message);
    }
  }
}
