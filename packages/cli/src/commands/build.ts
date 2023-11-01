import { KitaConfig, KitaError, parseConfig, readCompilerOptions } from '@kitajs/common';
import { KitaFormatter } from '@kitajs/generator';
import { KitaParser } from '@kitajs/parser';
import { Command, Flags, ux } from '@oclif/core';
import chalk from 'chalk';
import fs from 'fs/promises';
import path from 'path';
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
    ['import-source']: Flags.boolean({
      char: 's',
      description:
        'Maps all imports directly to source files instead of the usual dist folder. Needs tsx/ts-node/swc to work.',
      default: false
    }),
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
    }),
    root: Flags.string({
      char: 'r',
      description: 'Custom root directory for your project.'
    })
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(Build);

    this.log(chalk.yellow`Thanks for using Kita! 🎉\n`);

    try {
      let readConfig: KitaConfig | undefined;

      const root = flags.root ?? process.cwd();

      // Tries to lookup for a default config file
      const defaultConfigPath = path.resolve(root, 'kita.config.js');

      if (flags.config) {
        flags.config = path.resolve(root, flags.config);
      } else if (await fs.stat(defaultConfigPath).catch(() => false)) {
        flags.config = defaultConfigPath;
      }

      if (flags.config) {
        ux.action.start('Reading config', '', { stdout: true, style: 'clock' });

        const exists = await fs.stat(flags.config).catch(() => false);

        if (!exists) {
          this.error(`Config file does not exist: ${flags.config}`);
        }

        const cfg = require(flags.config);

        if (typeof cfg !== 'object') {
          this.error(`Config file must export an object.`);
        }

        // Esm
        if (typeof cfg.default === 'object') {
          readConfig = cfg.default;
        } else {
          readConfig = cfg;
        }

        ux.action.stop(chalk.cyan(`.${path.sep}${path.relative(root, flags.config)}`));
      }

      ux.action.start('Warming up', '', {
        stdout: true,
        style: 'clock'
      });

      ux.action.status = 'Parsing config';
      const config = parseConfig(readConfig, flags.root);

      // Overrides dist if source is enabled
      if (flags['import-source']) {
        config.dist = false;
      }

      ux.action.status = 'Parsing compiler options';

      const compilerOptions = readCompilerOptions(config.tsconfig);

      if (flags.debug) {
        ux.action.stop();
        ux.styledJSON({ config, compilerOptions });
        return this.exit(0);
      }

      ux.action.status = 'Building formatter';

      const formatter = new KitaFormatter(config, compilerOptions);

      ux.action.status = 'Creating parser';

      const parser = KitaParser.create(config, compilerOptions);

      if (!parser.routePaths.length) {
        this.error('No routes found.');
      }

      // Generate routes on the fly
      parser.onRoute = async (route) => {
        ux.action.status = route.schema.operationId;
        formatter.generateRoute(route);
      };

      parser.onProvider = async (provider) => {
        ux.action.status = provider.type;
      };

      parser.onSchema = async (schema) => {
        if (schema.title) {
          ux.action.status = schema.title;
        } else if (schema.$ref) {
          ux.action.status = schema.$ref;
        }
      };

      formatter.onWrite = (filename) => {
        ux.action.status = filename;
      };

      ux.action.stop(chalk.cyan`Ready to build!`);

      ux.action.start('Reading sources', '', {
        stdout: true,
        style: 'clock'
      });

      let diagnostics = [];

      // Should not emit any errors
      for await (const error of parser.parse()) {
        ux.action.status = error.name;
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
        await formatter.generate(routes, schemas, plugins);

        ux.action.start(`Generating ${chalk.cyan`@kitajs/runtime`}`, '', {
          stdout: true,
          style: 'clock'
        });

        await formatter.flush();

        ux.action.stop(`${chalk.green(formatter.writer.fileCount())} files written.`);
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
