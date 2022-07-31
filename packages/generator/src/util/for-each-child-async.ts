import ts from 'typescript';

/** Async await forEachChild */
export function forEachChild<T>(
  source: ts.SourceFile,
  callback: (node: ts.Node) => Promise<T> | T
) {
  const promises = [] as (Promise<T> | T)[];

  ts.forEachChild(source, (node) => {
    promises.push(callback(node));
  });

  return Promise.all(promises);
}
