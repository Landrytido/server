export default class NoSuchFilenameException extends Error {
  constructor() {
    super('An uploaded file must have a name');
  }
}
