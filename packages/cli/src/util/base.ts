import {
  AstCollector,
  KitaConfig,
  KitaError,
  PartialKitaConfig,
  SourceFormatter,
  readCompilerOptions
} from '@kitajs/common';
import { Command, Flags, ux } from '@oclif/core';
import { CommandError } from '@oclif/core/lib/interfaces';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { readConfig } from './config';
import { formatDiagnostic, formatStatus } from './diagnostics';

export abstract class BaseKitaCommand extends Command {
  static override baseFlags = {
    config: Flags.file({
      char: 'c',
      exists: true,
      description: 'Path to your kita.config.js file, if any.',
      helpGroup: 'global'
    }),
    cwd: Flags.directory({
      description: 'Sets the current working directory for your command.',
      required: false,
      helpGroup: 'global',
      exists: true
    })
  };

  protected parseConfig(flags: Record<string, unknown>, extension?: PartialKitaConfig) {
    const config = readConfig(String(flags.cwd) ?? process.cwd(), this.error, String(flags.config), extension);

    return {
      config,
      compilerOptions: readCompilerOptions(config.tsconfig)
    };
  }

  protected printSponsor() {
    if (process.stdout.isTTY) {
      if (
        // defined environments should not show the message
        process.env.NODE_ENV === undefined &&
        // 50% chance of showing the sponsor message
        Math.random() < 0.5
      ) {
        this.log(
          chalk`{grey    Please support my open source work ❤️  \nhttps://github.com/sponsors/arthurfiorette\n}`
        );
      }

      // terminal may not be 256 color compatible
      this.log(chalk`Thanks for using {${chalk.level > 1 ? `hex('#b58d88')` : 'yellow'} Kita}! 🎉\n`);
    }
  }

  protected async resetRuntime(config: KitaConfig, copyRuntime = true) {
    ux.action.start('Clearing runtime', '', {
      stdout: true,
      style: 'clock'
    });

    await fs.promises.rm(config.runtimePath, { recursive: true });

    // Maybe the generation step is being called shortly after the reset
    if (copyRuntime) {
      await fs.promises.cp(path.resolve(__dirname, '../../runtime'), config.runtimePath, {
        recursive: true
      });
    }

    ux.action.stop(chalk`{cyan .${path.sep}${path.relative(config.cwd, config.runtimePath)}}`);
  }

  protected async runParser(parser: AstCollector, formatter?: SourceFormatter, reset?: boolean, config?: KitaConfig) {
    ux.action.start('Parsing sources', '', {
      stdout: true,
      style: 'clock'
    });

    const diagnostics = [];

    // Should not emit any errors
    for await (const error of parser.parse()) {
      diagnostics.push(error.diagnostic);
    }

    ux.action.stop(formatStatus(parser, diagnostics));

    if (diagnostics.length) {
      this.log(formatDiagnostic(diagnostics));
    }

    if (formatter) {
      if (reset && config) {
        await this.resetRuntime(config, false);
      }

      ux.action.start(chalk`Generating {cyan @kitajs/runtime}`, '', {
        stdout: true,
        style: 'clock'
      });

      const writeCount = await formatter.flush();

      ux.action.stop(chalk`{${config?.declaration ? 'blue' : 'yellow'} ${writeCount}} files written.`);
    } else {
      this.log(chalk`{yellow Skipping generation process.}`);
    }

    return diagnostics;
  }

  protected override async catch(error: CommandError) {
    // Pretty handle kita errors
    if (error instanceof KitaError) {
      this.logToStderr(formatDiagnostic([error.diagnostic]));
      this.exit(1);
    }

    throw error;
  }
}
