export default class WrongInputDataException extends Error {
  constructor(message = '') {
    super(`Data is wrong.${message !== '' ? ` ${message}` : ''}`);
  }
}
