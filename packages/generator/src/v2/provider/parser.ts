import ts from 'typescript';
import { BaseProvider } from '../models';
import { isDefaultExportFunction } from '../util/nodes';

export function parseProvider(source: ts.SourceFile): BaseProvider {
  const handler = source.statements.find(isDefaultExportFunction);

  if (!handler) {
    throw new Error('No default export function found');
  }

  console.log(handler);
  throw new Error('todo');

  // return {} as BaseProvider;
}
