const path = require('path');

/** @type {import('@kitajs/generator').KitaConfig} */
module.exports = {
  params: {
    AuthParam: path.resolve(__dirname, './src/helpers/auth-param')
  },
  routes: {
    format: require('../../.prettierrc.js'),
    output: path.resolve(__dirname, './src/routes.ts')
  }
};
