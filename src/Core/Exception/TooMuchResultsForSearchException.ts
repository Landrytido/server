export default class TooMuchResultsForSearchException extends Error {
  static message = 'Too much results for this search';

  constructor() {
    super(TooMuchResultsForSearchException.message);
  }
}
