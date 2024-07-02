export default class InsufficientPermissionException extends Error {
  constructor(message = '') {
    super(`You do not have permission to perform this action. ${message}`);
  }
}
