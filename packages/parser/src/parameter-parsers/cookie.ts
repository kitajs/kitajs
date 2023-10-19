import { Parameter, ParameterParser, Route, kRequestParam } from '@kitajs/common';
import type { ts } from 'ts-json-schema-generator';
import { getParameterName, getTypeNodeName, isParamOptional } from '../util/nodes';
import { buildAccessProperty } from '../util/syntax';

export class CookieParameterParser implements ParameterParser {
  agnostic = true;

  supports(param: ts.ParameterDeclaration) {
    return getTypeNodeName(param) === 'Cookie';
  }

  parse(param: ts.ParameterDeclaration, _route: Route): Parameter {
    const name = getParameterName(param, 0);

    const value = buildAccessProperty(kRequestParam, 'cookies', name);
    const optional = isParamOptional(param);

    return {
      name: CookieParameterParser.name,
      value: value,
      helper: optional
        ? undefined
        : // TODO: Add a better error, maybe import one from fastify?
          /* ts */ `if (${value} === undefined) { throw new Error('Missing cookie ${name}') };`
    };
  }
}
