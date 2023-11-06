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
    ${kKitaGlobalRoot} = process.env.${kKitaRoot};

    if (!${kKitaGlobalRoot}) {
      throw new Error('Please define ${kKitaGlobalRoot} before importing any routes.');
    }
  }

  exports.__esModule = true;

  // Export plugin
  tslib.__exportStar(require("./plugin"), exports);

  let resolve;
  exports.ready = new Promise((res) => void (resolve = res));

  setImmediate(() => {
    // Export all routes
${routes.map((r) => `    tslib.__exportStar(require("./routes/${r.schema.operationId}"), exports);`)}

    resolve();
  });

${ts.types}

  // Declares required global variables
  declare global {
    /**
     * This variable is required to be defined before any routes are imported. It should
     * be the dirname of your source files, usually the \`src\` or \`dist\` folder.
     */
    var ${kKitaRoot}: string;
  }

  /**
   * You can await this promise to make sure the runtime is ready and all cyclic
   * imports are resolved.
   */
  export declare const ready: Promise<void>;

  export * from './plugin';

  ${routes.map((r) => `export * from './routes/${r.schema.operationId}';`)}
  `;
}
