import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import ConsoleLogger from '../../Logging/ConsoleLogger';
import AuthenticationErrorEvent from './AuthenticationErrorEvent';
import SuccessfullyAuthenticatedEvent from './SuccessfullyAuthenticatedEvent';

@Injectable()
export default class AuthenticationEventSubscriber {
  constructor(private readonly logger: ConsoleLogger) {}

  @OnEvent('authentication.*')
  async handleAuthenticationEvents(
    event: SuccessfullyAuthenticatedEvent<any> | AuthenticationErrorEvent<any>
  ) {
    return this.logger.log({ ...event });
  }
}
