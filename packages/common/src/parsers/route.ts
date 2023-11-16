import type ts from 'typescript';
import type { Route } from '../ast';
import { Parser } from './parser';

/** A route parser is responsible for parsing a node into a route. */
export type RouteParser = Parser<ts.Node, Route>;
