import { AstCollector, KitaConfig, SourceFormatter, readCompilerOptions } from '@kitajs/common';
import { Command, Flags, ux } from '@oclif/core';
import chalk from 'chalk';
import { readConfig } from './config';
import { formatDiagnostic, formatStatus } from './diagnostics';

export abstract class BaseKitaCommand extends Command {
  static override baseFlags = {
    config: Flags.file({
      char: 'c',
      exists: true,
      description: 'Path to your kita.config.js file, if any.'
    }),
    cwd: Flags.directory({
      description: 'Sets the current working directory for your command.',
      required: false
    })
  };

  protected parseConfig(flags: Record<string, any>, extension?: Partial<KitaConfig>) {
    const config = readConfig(flags.cwd ?? process.cwd(), this.error, flags.config, extension);

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

  protected async runParser(parser: AstCollector, formatter: SourceFormatter, dryRun: boolean) {
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

    if (dryRun) {
      this.log(chalk`{yellow Skipping generation process.}`);
    } else {
      ux.action.start(chalk`Generating {cyan @kitajs/runtime}`, '', {
        stdout: true,
        style: 'clock'
      });

      const writeCount = await formatter.flush();

      ux.action.stop(chalk`{green ${writeCount}} files written.`);
    }

    return diagnostics;
  }
}
