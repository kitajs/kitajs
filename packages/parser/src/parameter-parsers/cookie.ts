import { AstCollector, Parameter, ParameterParser, Route, kRequestParam } from '@kitajs/common';
import type { ts } from 'ts-json-schema-generator';
import { getParameterName, getTypeNodeName, isParamOptional } from '../util/nodes';
import { buildAccessProperty } from '../util/syntax';

export class CookieParameterParser implements ParameterParser {
  constructor(private readonly collector: AstCollector) {}

  supports(param: ts.ParameterDeclaration) {
    return getTypeNodeName(param) === 'Cookie';
  }

  parse(param: ts.ParameterDeclaration, _route: Route): Parameter {
    if (!this.collector.getPlugin('fastifyCookie')) {
      this.collector.addPlugin('fastifyCookie', {
        name: 'fastifyCookie',
        importUrl: '@fastify/cookie',
        options: {}
      });
    }

    const name = getParameterName(param, 0);

    const value = buildAccessProperty(kRequestParam, 'cookies', name);
    const optional = isParamOptional(param);

    return {
      name: CookieParameterParser.name,
      value: value,
      helper: optional
        ? undefined
        : // TODO: Add a better error, maybe import one from fastify?
          `if (${value} === undefined) { throw new Error('Missing cookie ${name}') };`
    };
  }
}
