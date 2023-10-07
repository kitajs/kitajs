import { Route } from '@kitajs/common';
import { EOL } from 'os';

/** Re-exports everything this plugin have */
export const index = (routes: Route[]) =>
  /* ts */ `

export * from './schemas';
export * from './plugin';

${routes.map((r) => `export * from './routes/${r.schema.operationId}';`).join(EOL)}

`.trim();
