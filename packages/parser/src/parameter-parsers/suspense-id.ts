import { Parameter, ParameterParser, kRequestParam } from '@kitajs/common';
import type { ts } from 'ts-json-schema-generator';
import { getTypeNodeName } from '../util/nodes';
import { buildAccessProperty } from '../util/syntax';

export class SuspenseIdParameterParser implements ParameterParser {
  supports(param: ts.ParameterDeclaration) {
    return getTypeNodeName(param) === 'SuspenseId';
  }

  parse(): Parameter {
    return {
      name: SuspenseIdParameterParser.name,
      value: buildAccessProperty(kRequestParam, 'id')
    };
  }
}
