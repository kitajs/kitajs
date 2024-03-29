'use strict';

const tslib = require('tslib');

// If you are seeing this error, you probably forgot to define the globalThis.KITA_PROJECT_ROOT variable.
// Read more at https://kita.js.org/docs/runtime
if (!globalThis.KITA_PROJECT_ROOT) {
  globalThis.KITA_PROJECT_ROOT = process.env.KITA_PROJECT_ROOT;

  if (!globalThis.KITA_PROJECT_ROOT) {
    throw new Error('Please define globalThis.KITA_PROJECT_ROOT before importing any routes.');
  }
}

exports.__esModule = true;

// Export plugin
tslib.__exportStar(require('./plugin'), exports);

let resolve;
exports.ready = new Promise((res) => void (resolve = res));

setImmediate(() => {
  // Export all routes
  tslib.__exportStar(require('./routes/getHello'), exports);

  resolve();
});
