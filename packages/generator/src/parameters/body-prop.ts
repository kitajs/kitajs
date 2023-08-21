import { kRequestParam } from '../constants';
import type { BaseParameter } from '../models';
import { buildAccessProperty } from '../util/syntax';

export class BodyPropParameter implements BaseParameter {
  value: string;
  helper?: string | undefined;

  constructor(readonly name: string) {
    this.value = buildAccessProperty(kRequestParam, 'body', name);
  }
}
