import { Parameter, ParameterParser } from '@kitajs/common';
import type ts from 'typescript';
import { getTypeNodeName } from '../util/nodes';

export class RouteMetaParameterParser implements ParameterParser {
  agnostic = true;

  supports(param: ts.ParameterDeclaration) {
    return getTypeNodeName(param) === 'RouteMeta';
  }

  parse(): Parameter {
    // The actual content should be stringified by the route formatter if it finds
    // that one of its parameter is a RouteMeta
    return { value: 'RouteMeta' };
  }
}
