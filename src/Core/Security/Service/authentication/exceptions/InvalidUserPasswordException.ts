export default class InvalidUserPasswordException extends Error {
  constructor() {
    super('Invalid password');
  }
}
