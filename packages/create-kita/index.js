const oclif = require('@oclif/core');

/**
 * Calls the @kitajs/cli create command with the provided arguments.
 *
 * @param {boolean} development - Whether to run in development mode.
 * @param {string[]} [args] - The arguments to pass to the create command.
 */
module.exports = function createKita(development, args = process.argv.slice(2)) {
  return oclif.execute({
    dir: require.resolve('@kitajs/cli'),
    args: ['create', ...args],
    development
  });
};
