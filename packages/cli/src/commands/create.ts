import { Command, Flags, ux } from '@oclif/core';
import chalk from 'chalk';
import inquirer from 'inquirer';
import fs from 'node:fs';
import path from 'node:path';
import { printSponsor } from '../util/sponsor';

const AvailableTemplates = [
  { name: 'Kita', value: 'kita' },
  { name: 'Kita + JSX + Tailwind', value: 'kita-jsx' }
];

const TemplatesDir = path.resolve(__dirname, '../../templates');

export default class Create extends Command {
  static override description = 'Scaffolds a new project with Kita';

  static override examples = [
    {
      command: '<%= config.bin %> <%= command.id %> -n mybackend',
      description: 'Scaffolds a project called mybackend.'
    }
  ];

  static override flags = {
    name: Flags.string({
      char: 'n',
      description: 'The name of the project.'
    }),
    dir: Flags.string({
      char: 'd',
      description: 'The directory to create the project in.'
    }),
    template: Flags.string({
      char: 't',
      description: 'The template to use.',
      options: AvailableTemplates.map((t) => t.value)
    }),
    yes: Flags.boolean({
      char: 'y',
      description: 'Skips the prompts and uses the defaults.',
      default: false
    })
  };

  async run(): Promise<void> {
    printSponsor(this);

    const { flags } = await this.parse(Create);

    if (!process.stdout.isTTY) {
      this.error('This command requires an interactive terminal.', { exit: 1 });
    }

    const answers = await inquirer.prompt<{ projectName: string; directory: string; template: string }>(
      [
        {
          type: 'input',
          name: 'projectName',
          message: 'What is the name of your project?',
          default: flags.name || process.cwd().split('/').pop()!,
          when: !flags.yes,
          askAnswered: true
        },
        {
          type: 'input',
          name: 'directory',
          message: 'Where would you like to create your project?',
          default: flags.dir || './' /* More readable */,
          when: !flags.yes,
          askAnswered: true,
          filter: (input) => path.resolve(input)
        },
        {
          type: 'list',
          name: 'template',
          message: 'Which template would you like to use?',
          default: flags.template || 'kita',
          choices: [...AvailableTemplates, { name: 'Others', disabled: 'Coming soon', short: 'Others' }],
          when: !flags.yes,
          askAnswered: true
        }
      ],
      {
        projectName: process.cwd().split('/').pop()!,
        directory: path.resolve(flags.dir || ''),
        template: 'kita'
      }
    );

    ux.action.start('Creating project', 'This may take a few seconds', {
      stdout: true,
      style: 'clock'
    });

    // Recursively creates the directory
    await fs.promises.mkdir(answers.directory, { recursive: true });

    // Fails if a package.json already exists
    if (fs.existsSync(path.resolve(answers.directory, 'package.json'))) {
      this.error('A package.json already exists in the selected directory.', { exit: 1 });
    }

    // copies the template to the selected directory
    await fs.promises.cp(path.resolve(TemplatesDir, answers.template), answers.directory, { recursive: true });

    // replaces package.json and reame @kitajs/template with the project name
    const packageJsonPath = path.resolve(answers.directory, 'package.json');
    const packageJson = JSON.parse(await fs.promises.readFile(packageJsonPath, 'utf-8'));
    packageJson.name = answers.projectName;
    await fs.promises.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));

    const readmePath = path.resolve(answers.directory, 'README.md');
    const readme = await fs.promises.readFile(readmePath, 'utf-8');
    await fs.promises.writeFile(readmePath, readme.replace('@kitajs/template', answers.projectName));

    ux.action.stop(chalk`{cyan Project created successfully!}`);

    const relativeness = path.relative(process.cwd(), answers.directory);

    this.log(
      chalk`
To get started, run the following commands:
${relativeness ? chalk`\n{cyan $} cd {yellow ${relativeness}}` : ''}
{cyan $} npm install
{cyan $} npm run dev

{cyan Happy hacking!}

To learn more about {${chalk.level > 1 ? `hex('#b58d88')` : 'yellow'} Kita}, visit our website:
https://kita.js.org`
    );
  }
}
