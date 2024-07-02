export default abstract class PaginatedEntity<T> {
  abstract total: number;
  abstract results: T;
}
