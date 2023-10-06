import { createWriteStream } from 'fs';
import { inspect } from 'util';

export function proxyObject<T extends object>(obj: T): T {
  const proxy: T = Object.create(null);

  for (let k of Object.keys(obj) as Array<keyof T>) {
    const x = obj[k]!;
    // @ts-expect-error - JS runtime trickery which is tricky to type tersely
    proxy[k] = (...args: Array<{}>) => x.apply(obj, args);
  }

  return proxy;
}

const log = createWriteStream('/home/hzk/dev/kitajs/packages/ts-plugin/logs.txt');

export function l(msg: string | object) {
  if (typeof msg === 'object') {
    msg = inspect(msg, { depth: 10 });
  }

  log.write(msg.trim() + '\n');
}
