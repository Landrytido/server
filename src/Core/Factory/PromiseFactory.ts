export default class PromiseFactory {
  create<T>(executor: (resolve: (value: T) => void, reject: (reason?: any) => void) => void): Promise<T> {
    return new Promise(executor);
  }

  async createCollectionOfPromise(iterable: Iterable<any>) {
    return Promise.all(iterable);
  }
}
