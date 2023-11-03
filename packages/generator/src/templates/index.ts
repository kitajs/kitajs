import { Route, kKitaGlobalRoot, kKitaRoot } from '@kitajs/common';
import { ts } from 'ts-writer';

// TODO: FIx the globalRoot documentation link
export function generateIndex(routes: Route[]) {
  return ts`${'index'}
  'use strict';

  const tslib = require("tslib");

  // If you are seeing this error, you probably forgot to define the ${kKitaGlobalRoot} variable.
  // Read more at https://kita.js.org/docs/runtime
  if (!${kKitaGlobalRoot}) {
    throw new Error('Please define ${kKitaGlobalRoot} before importing any routes.')
  }

  // Export plugin
  tslib.__exportStar(require("./plugin"), exports);

  // Export all routes
  ${routes.map((r) => `tslib.__exportStar(require("./routes/${r.schema.operationId}"), exports);`)}

${ts.types}

  // Declares required global variables
  declare global {
    /**
     * This variable is required to be defined before any routes are imported. It should
     * be the dirname of your source files, usually the \`src\` or \`dist\` folder.
     */
    var ${kKitaRoot}: string;
  }

  export * from './plugin';

  ${routes.map((r) => `export * from './routes/${r.schema.operationId}';`)}
  `;
}

/** Re-exports everything this plugin have */
export const index = (routes: Route[]) =>
  `

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
