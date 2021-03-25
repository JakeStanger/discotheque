import TTLCache from './TTLCache';

const caches: Record<string, TTLCache> = {};

function getCache(name: string, ttl: number) {
  if (!(name in caches)) {
    caches[name] = new TTLCache<string, any>({ ttl });
  }

  return caches[name];
}

function cache(ttl = 5000): MethodDecorator {
  return function (target: any, propertyKey, descriptor) {
    const cacheName = `${target.constructor.name}#${propertyKey.toString()}`;
    const cache = getCache(cacheName, ttl);

    // eslint-disable-next-line @typescript-eslint/ban-types
    const func: Function = descriptor.value as any;
    descriptor.value = function () {
      // eslint-disable-next-line prefer-rest-params
      const cacheKey = JSON.stringify(arguments[0]);

      const cacheValue = cache.get(cacheKey);
      if (cacheValue !== undefined) {
        return Promise.resolve(cacheValue);
      }

      // eslint-disable-next-line prefer-rest-params
      return func.apply(this, arguments).then((res) => {
        if (res) {
          cache.set(cacheKey, res);
        }

        return res;
      });
    } as any;
  };
}

export default cache;
