import type { Body } from '@kitajs/runtime';

export interface Exported {
  b: number;
}

interface NotExported {
  c: number;
}

interface G {
  a: number;
  b: Exported[];
  c: Exported;
  d: NotExported;
  e: NotExported[];
}

export interface H {
  a: number;
  b: Exported[];
  c: Exported;
  d: NotExported;
  e: NotExported[];
}

export function post(
  body: Body<{
    a: number;
    b: Exported[];
    c: Exported;
    d: NotExported;
    e: NotExported[];
    f: {
      a: number;
      b: Exported[];
      c: Exported;
      d: NotExported;
      e: NotExported[];
    };
    g: G;
    h: H;
  }>
) {
  return body;
}
