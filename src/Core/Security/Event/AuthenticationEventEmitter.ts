import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventPayload } from '../../Event/Entity/Event';
import AuthenticationErrorEvent from './AuthenticationErrorEvent';
import SuccessfullyAuthenticatedEvent from './SuccessfullyAuthenticatedEvent';

export enum AuthenticationEvents {
  SUCCESSFULLY_AUTHENTICATED = 'authentication.successfully',
  ERROR = 'authentication.error',
}

@Injectable()
export default class AuthenticationEventEmitter {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  emit(eventType: AuthenticationEvents, payload: EventPayload) {
    switch (eventType) {
      case AuthenticationEvents.SUCCESSFULLY_AUTHENTICATED:
        return this.eventEmitter.emit(eventType, new SuccessfullyAuthenticatedEvent(eventType, payload));
      case AuthenticationEvents.ERROR:
        return this.eventEmitter.emit(eventType, new AuthenticationErrorEvent(eventType, payload));
    }
  }
}
