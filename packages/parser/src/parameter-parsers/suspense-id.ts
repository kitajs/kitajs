import { Parameter, ParameterParser } from '@kitajs/common';
import type ts from 'typescript';
import { kRequestParam } from '../util/constants';
import { getTypeNodeName } from '../util/nodes';
import { buildAccessProperty } from '../util/syntax';

export class SuspenseIdParameterParser implements ParameterParser {
  agnostic = true;

  supports(param: ts.ParameterDeclaration) {
    return getTypeNodeName(param) === 'SuspenseId';
  }

  parse(): Parameter {
    return {
      value: buildAccessProperty(kRequestParam, 'id'),
      //@ts-expect-error - internal property
      __type: 'SuspenseId'
    };
  }
}
