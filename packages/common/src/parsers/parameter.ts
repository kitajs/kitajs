import type ts from 'typescript';
import type { Parameter, Route } from '../ast';
import { Parser } from './parser';

/** A parameter parser is responsible for parsing a node into a parameter. */
export interface ParameterParser
  extends Parser<ts.ParameterDeclaration, Parameter, [Route | null, ts.FunctionDeclaration, number]> {}
