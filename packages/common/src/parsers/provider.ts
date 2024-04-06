import type ts from 'typescript';
import type { Provider } from '../ast';
import type { Parser } from './parser';

/** A route parser is responsible for parsing a node into a route. */
export type ProviderParser = Parser<ts.SourceFile, Provider | undefined>;
