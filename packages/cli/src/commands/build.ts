import { KitaError, readCompilerOptions } from '@kitajs/common';
import { KitaFormatter } from '@kitajs/generator';
import { KitaParser } from '@kitajs/parser';
import { Command, Flags, ux } from '@oclif/core';
import chalk from 'chalk';
import { readConfig } from '../util/config';
import { formatDiagnostic } from '../util/diagnostics';

export default class Build extends Command {
  static override description = 'Analyses your backend searching for routes and bakes it into the runtime.';

  static override examples = [
    {
      command: `<%= config.bin %> <%= command.id %> -c kita.config.js`,
      description: 'Builds your backend with a custom config file.'
    },
    {
      command: `<%= config.bin %> <%= command.id %> -d`,
      description: 'Fast checks your backend for errors without generating the runtime.'
    }
  ];

  static override flags = {
    config: Flags.file({
      char: 'c',
      exists: true,
      description: 'Path to your kita.config.js file, if any.'
    }),
    debug: Flags.boolean({
      description: 'Prints full resolved config to stdout.',
      default: false
    }),
    ['dry-run']: Flags.boolean({
      char: 'd',
      description: 'Skips generation process. Useful for testing your code.',
      default: false
    })
  };

  static override args = {};

  async run(): Promise<void> {
    const { flags } = await this.parse(Build);

    this.log(chalk.yellow`Thanks for using Kita! 🎉\n`);

    try {
      const config = readConfig(flags.root ?? process.cwd(), this.error, flags.config, true);

      ux.action.start('Warming up', '', {
        stdout: true,
        style: 'clock'
      });

      ux.action.status = 'Parsing compiler options';

      const compilerOptions = readCompilerOptions(config.tsconfig);

      if (flags.debug) {
        ux.action.stop();
        ux.styledJSON({ config, compilerOptions });
        return this.exit(0);
      }

      ux.action.status = 'Building formatter';

      const formatter = new KitaFormatter(config);

      ux.action.status = 'Creating parser';

      const parser = KitaParser.create(config, compilerOptions);

      if (!parser.routePaths.length) {
        this.error('No routes found.');
      }

      // Generate routes on the fly
      parser.onRoute = async (route) => {
        formatter.generateRoute(route);
      };

      ux.action.stop(chalk.cyan`Ready to build!`);

      ux.action.start('Reading sources', '', {
        stdout: true,
        style: 'clock'
      });

      let diagnostics = [];

      // Should not emit any errors
      for await (const error of parser.parse()) {
        diagnostics.push(error.diagnostic);
      }

      const routes = parser.getRoutes();
      const schemas = parser.getSchemas();
      const plugins = parser.getPlugins();
      const providers = parser.getProviderCount();

      ux.action.stop(
        `${routes.length ? chalk.green(routes.length) : chalk.red(routes.length)} routes / ${
          schemas.length ? chalk.green(schemas.length) : chalk.yellow(schemas.length)
        } schemas / ${providers ? chalk.green(providers) : chalk.yellow(providers)} providers | ${
          diagnostics.length ? chalk.red(diagnostics.length) : chalk.green(diagnostics.length)
        } errors`
      );

      if (diagnostics.length) {
        this.log(formatDiagnostic(diagnostics));
      }

      if (!flags['dry-run']) {
        await formatter.generateRuntime(routes, schemas, plugins);

        ux.action.start(`Generating ${chalk.cyan`@kitajs/runtime`}`, '', {
          stdout: true,
          style: 'clock'
        });

        ux.action.stop(`${chalk.green(formatter.writeCount)} files written.`);
      }

      if (diagnostics.length > 0) {
        this.error(chalk.red`Finished with errors!`);
      }

      if (flags['dry-run']) {
        this.log(chalk.green`\nNo errors were found!`);
        this.log(chalk.yellow`You need to run it again without --dry-run to generate the runtime.`);
      } else {
        this.log(chalk.green`\nRuntime is ready to use!`);
      }

      this.exit(0);
    } catch (error) {
      if (error instanceof KitaError) {
        this.logToStderr(formatDiagnostic([error.diagnostic]));
        this.exit(1);
      }

      throw error;
    }
  }
}
