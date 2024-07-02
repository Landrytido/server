export interface Identifiable {
  id: number,
}

export interface EnablableService {
  isEnabled(): boolean,
}

export type WorkerService<Return, Parameters> = EnablableService

export interface HandlerService<Return, Parameters> {
  handle: (...params: Parameters) => Return,
}

export interface ValidatorService<Parameters> {
  validate: (...params: Parameters) => boolean,
}

export interface BuilderService<Return, Parameters> {
  build: (...params: Parameters) => Return,
}

export interface AdapterService<Return, Parameters extends Array<any>> {
  adapt: (...params: Parameters) => Return,
}

export type UseCase<Return, Parameters> = HandlerService<Return, [ContextualGraphqlRequest, ...Parameters]>

export type UncontextualUseCase<Return, Parameters> = HandlerService<Return, [...Parameters]>

export type ContextualGraphqlRequest = { userId: number, email: string, roles: string[], };

type Optional<T, K extends keyof T> = {
  [P in K]?: T[P];
};

export interface Countable {
  count: number,
}

export interface Findable<T> {
  find: () => T,
}

export interface Encrypter {
  encrypt: (text: string) => string,
  decrypt: (encryptedText: string) => string,
}
