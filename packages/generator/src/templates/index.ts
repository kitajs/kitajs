import { Route } from '@kitajs/common';

/** Re-exports everything this plugin have */
export const index = (routes: Route[]) =>
  /* ts */ `

export * from './plugin';

let resolve;
/**
 * You can await this promise to make sure the runtime is ready and all cyclic 
 * imports are resolved.
 */
export const ready = new Promise<void>((res) => void (resolve = res));

// set-immediate-start
${routes.map((r) => `export * from './routes/${r.schema.operationId}';`).join('\n')}

resolve();
// set-immediate-end

`.trim();
