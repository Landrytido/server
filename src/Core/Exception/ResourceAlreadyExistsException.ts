export default class ResourceAlreadyExistsException extends Error {
  constructor() {
    super('Resource already exists');
  }
}
