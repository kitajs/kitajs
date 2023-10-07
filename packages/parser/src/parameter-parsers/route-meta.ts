import { Parameter, ParameterParser, Route } from '@kitajs/common';
import type ts from 'typescript';
import { getTypeNodeName } from '../util/nodes';

export class RouteMetaParameterParser implements ParameterParser {
  agnostic = true;

  supports(param: ts.ParameterDeclaration) {
    return getTypeNodeName(param) === 'RouteMeta';
  }

  parse(_: ts.ParameterDeclaration, route: Route): Parameter {
    // The actual content should be stringified by the route formatter.
    return { value: `${route.schema.operationId}Meta` };
  }
}
