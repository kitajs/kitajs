import type { BaseParameter } from '../bases';
import { kRequestParam } from '../constants';
import { buildAccessProperty } from '../util/syntax';

export class HeaderParameter implements BaseParameter {
  value: string;
  helper?: string | undefined;

  constructor(readonly name: string) {
    this.value = buildAccessProperty(kRequestParam, 'headers', name.toLowerCase());
  }
}
