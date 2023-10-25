import { Route } from '@kitajs/common';
import { EOL } from 'os';

/** Re-exports everything this plugin have */
export const index = (routes: Route[]) =>
  /* ts */ `

export * from './plugin';

// set-immediate-start
${routes.map((r) => `export * from './routes/${r.schema.operationId}';`).join(EOL)}
// set-immediate-end

`.trim();
