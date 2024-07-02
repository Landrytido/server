/* istanbul ignore file */

import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export default abstract class EventEmitter {
  constructor(protected readonly eventEmitter: EventEmitter2) {}

  abstract emit(event: string, payload: any);
}
