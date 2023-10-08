const path = require('path');

/** @type {import('@kitajs/common').KitaConfig} */
module.exports = {
  cwd: path.resolve(__dirname, 'test'),
  controllers: {
    glob: ['test/*/routes/**/*.ts']
  },
  providers: {
    glob: ['test/*/providers/**/*.ts']
  }
};
