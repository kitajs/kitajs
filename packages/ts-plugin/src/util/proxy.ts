export function proxyObject<T extends object>(obj: T): T {
  const proxy: T = Object.create(null);

  for (const k of Object.keys(obj) as Array<keyof T>) {
    const x = obj[k]!;
    // @ts-expect-error - JS runtime trickery which is hard to type tersely
    proxy[k] = (...args: unknown[]) => x.apply(obj, args);
  }

  return proxy;
}
