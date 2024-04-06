import {
  KitaError,
  readCompilerOptions,
  type AstCollector,
  type KitaConfig,
  type PartialKitaConfig,
  type SourceFormatter
} from '@kitajs/common';
import { KitaFormatter } from '@kitajs/generator';
import { KitaParser } from '@kitajs/parser';
import { Command, Flags, ux } from '@oclif/core';
import type { CommandError } from '@oclif/core/lib/interfaces';
import chalk from 'chalk';
import fs from 'node:fs';
import path from 'node:path';
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

  protected parseConfig(flags: Record<string, unknown>, extension?: PartialKitaConfig, useUx = true) {
    const config = readConfig(
      String(flags.cwd ?? process.cwd()),
      this.error,
      String(flags.config ?? ''),
      extension,
      useUx
    );

    return {
      config,
      compilerOptions: readCompilerOptions(config.tsconfig)
    };
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

  /**
   * If the user's source code imports any type only available inside the generated runtime, the first build will fail
   * because these imports resolves to an inexistent file, by running the parser twice we can avoid this problem.
   */
  protected async prepareFirstRun(config: KitaConfig, compilerOptions: any) {
    ux.action.start('Searching runtime', '', {
      stdout: true,
      style: 'clock'
    });

    if (
      await fs.promises.access(path.join(config.runtimePath, 'plugin.js')).then(
        () => true,
        () => false
      )
    ) {
      ux.action.stop(chalk`{cyan Found!}`);
      return;
    }

    const formatter = new KitaFormatter(config, true);
    const parser = KitaParser.create(config, compilerOptions, compilerOptions.rootNames, formatter);

    // Ignores all errors, just generates something
    for await (const _ of parser.parse());
    await formatter.flush();

    ux.action.stop(chalk`{yellow First run!}`);
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
