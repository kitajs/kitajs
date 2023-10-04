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
  agnostic?: boolean;

  /**
   * A synthetic parameter is a resolver which should not return a value. The only current case for this is the
   * {@linkcode ThisParameterParser} which is used to bind the `this` keyword to a parameter.
   */
  synthetic?: boolean;
}
