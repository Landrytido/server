export default class NoResultForSearchException extends Error {
  static message = 'There is no result for this search';

  constructor() {
    super(NoResultForSearchException.message);
  }
}
