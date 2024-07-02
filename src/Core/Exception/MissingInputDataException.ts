export default class MissingInputDataException extends Error {
  constructor(message = '') {
    super(`Data is missing.${message !== '' ? ` ${message}` : ''}`);
  }
}
