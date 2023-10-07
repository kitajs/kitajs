import { Parameter, ParameterParser, Route, kRequestParam } from '@kitajs/common';
import type ts from 'typescript';
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
      value: value,
      helper: optional
        ? undefined
        : /* ts */ `if (${value} === undefined) { throw new Error('Missing cookie ${name}') };`
    };
  }
}
