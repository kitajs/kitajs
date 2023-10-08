// Default kitajs config.
// https://kita.js.org/

/** @type {import('@kitajs/common').KitaConfig} */
module.exports = {
  tsconfig: require.resolve('./tsconfig.json'),
  cwd: __dirname
};
