import { KitaConfig, KitaError, parseConfig, readCompilerOptions } from '@kitajs/common';
import { KitaFormatter } from '@kitajs/generator';
import { KitaParser } from '@kitajs/parser';
import { Command, Flags, ux } from '@oclif/core';
import chalk from 'chalk';
import fs from 'fs/promises';
import { EOL } from 'os';
import path from 'path';
import { inspect } from 'util';
import { formatDiagnostic } from '../util/diagnostics';

export default class Build extends Command {
  static override description = 'Analyses your backend searching for routes and bakes it into the runtime.';

  static override examples = [
    {
      command: `<%= config.bin %> <%= command.id %> -s -c kita.config.js`,
      description: 'Builds your backend to be used with tsx, ts-node or swc and uses a custom config file.'
    },
    {
      command: `<%= config.bin %> <%= command.id %> -d -r packages/server`,
      description: 'Builds your backend to be used with transpiled javascript code and uses a custom root directory.'
    }
  ];

  static override flags = {
    dist: Flags.boolean({
      char: 'd',
      description: 'Uses transpiled javascript code. {KitaConfig#dist=true}',
      default: true,
      exclusive: ['source']
    }),
    source: Flags.boolean({
      char: 's',
      description: 'Uses source typescript code. Needs tsx/ts-node registered. {KitaConfig#dist=false}',
      default: false,
      exclusive: ['dist']
    }),
    config: Flags.string({
      char: 'c',
      description: 'Path to your kita.config.js file, if any.'
    }),
    root: Flags.string({
      char: 'r',
      description: 'Custom root directory for your project. {KitaConfig#cwd}'
    }),
    print: Flags.boolean({
      name: 'print-config',
      description: 'Prints full resolved config',
      default: false
    })
  };

  static override args = {};

  async run(): Promise<void> {
    const { flags } = await this.parse(Build);

    this.log(chalk.yellow`Thanks for using Kita! 🎉\n`);

    try {
      let readConfig: KitaConfig | undefined;

      if (flags.config) {
        if (flags.root) {
          flags.config = path.resolve(flags.root, flags.config);
        }

        const exists = await fs.stat(flags.config).catch(() => false);

        if (!exists) {
          this.error(`Config file does not exist: ${flags.config}`);
        }

        let cfg = require(flags.config);

        if (typeof cfg !== 'object') {
          this.error(`Config file must export an object.`);
        }

        // Esm
        if (typeof cfg.default === 'object') {
          cfg = cfg.default;
        } else {
          cfg = cfg;
        }
      }

      const config = parseConfig(readConfig, flags.root);

      // Overrides dist and source flags
      if (flags.dist) {
        config.dist = true;
      } else if (flags.source) {
        config.dist = false;
      }

      const compilerOptions = readCompilerOptions(config.tsconfig);

      if (flags.print) {
        this.log(inspect({ config, compilerOptions }, { colors: !flags.noColor, depth: 10 }));
      }

      const formatter = new KitaFormatter(config, compilerOptions);
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
        ux.action.status = schema.title;
      };

      ux.action.start('Starting build', 'initializing', {
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
      const providers = parser.getProviderCount();

      ux.action.stop(
        `${routes.length ? chalk.green(routes.length) : chalk.red(routes.length)} routes / ${
          schemas.length ? chalk.green(schemas.length) : chalk.yellow(schemas.length)
        } schemas / ${providers ? chalk.green(providers) : chalk.yellow(providers)} providers / ${
          diagnostics.length ? chalk.red(diagnostics.length) : chalk.green(diagnostics.length)
        } errors`
      );

      if (diagnostics.length) {
        this.log(EOL + formatDiagnostic(diagnostics));
      }

      await formatter.generate(routes, schemas);

      ux.action.start('Writing files', 'transpiling', {
        stdout: true,
        style: 'clock'
      });

      await formatter.flush();

      ux.action.stop(`${chalk.green(formatter.writer.fileCount())} files written.`);

      if (diagnostics.length > 0) {
        this.error(chalk.red`Finished with errors!`);
      } else {
        this.log(chalk.green`Everything is ready!`);
        this.exit(0);
      }
    } catch (error) {
      if (error instanceof KitaError) {
        this.logToStderr(formatDiagnostic([error.diagnostic]));
        this.exit(1);
      }

      throw error;
    }
  }
}
