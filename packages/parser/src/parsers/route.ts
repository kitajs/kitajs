import type { Route } from '@kitajs/common';
import type ts from 'typescript';
import { Parser } from './parser';

/** A route parser is responsible for parsing a node into a route. */
export interface RouteParser extends Parser<ts.Node, Route> {}
