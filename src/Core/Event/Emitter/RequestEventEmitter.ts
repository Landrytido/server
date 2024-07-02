import { Injectable } from '@nestjs/common';
import { EventPayload } from '../Entity/Event';
import FailedRequestEvent from '../Entity/FailedRequestEvent';
import SuccessfulRequestEvent from '../Entity/SuccessfulRequestEvent';
import EventEmitter from './EventEmitter';

@Injectable()
export default class RequestEventEmitter extends EventEmitter {
  emit<E extends EventPayload>(event: string, payload: E) {
    if (event.includes('failed')) {
      return this.eventEmitter.emit(event, new FailedRequestEvent(event, payload));
    }

    return this.eventEmitter.emit(event, new SuccessfulRequestEvent(event, payload));
  }
}
