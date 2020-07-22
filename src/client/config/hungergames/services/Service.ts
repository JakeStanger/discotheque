abstract class Service<T> {
  private static BASE_URL = '/api/hungergames';
  protected resourceUrl: string;

  private url(path: string) {
    return Service.BASE_URL + this.resourceUrl + path;
  }

  private async fetch<R>(input: RequestInfo, init?: RequestInit): Promise<R> {
    const response = await fetch(input, init).then(r => r.json());
    if (!response.error) {
      return response;
    } else {
      throw new Error(response.error);
    }
  }

  protected constructor(resourceUrl: string) {
    this.resourceUrl = resourceUrl;
  }

  public async getAll(): Promise<T[]> {
    return this.fetch<T[]>(this.url(''));
  }

  public async getOne(id: string): Promise<T> {
    return this.fetch<T>(this.url(`/${id}`));
  }

  public async add(update: Partial<T>) {
    return this.fetch<T>(this.url(''), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(update)
    });
  }

  public async update(id: string, update: Partial<T>) {
    return this.fetch<T>(this.url(`/${id}`), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(update)
    });
  }

  public async delete(id: string) {
    return this.fetch<void>(this.url(`/${id}`), {
      method: 'DELETE'
    });
  }
}

export default Service;
