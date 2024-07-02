export type EventPayload = Record<any, any>;

export default class Event<P extends EventPayload> {
  constructor(readonly name = '', readonly payload: P) {}
}
