import type ts from 'typescript';
import type { Parameter, Route } from '../ast';
import { Parser } from './parser';

/** A parameter parser is responsible for parsing a node into a parameter. */
export interface ParameterParser
  extends Parser<ts.ParameterDeclaration, Parameter, [Route | null, ts.FunctionDeclaration, number]> {
  /**
   * If this parameter DOES NOT NEEDS a route to operate on. Normally this only happens if the parameter does not
   * generates any schema.
   *
   * If this boolean is true, the parser will throw {@linkcode AgnosticRouteConflictError} if the provided route is null.
   */
  agnostic: boolean;
}
