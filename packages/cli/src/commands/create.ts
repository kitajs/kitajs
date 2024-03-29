import { Command, Flags } from '@oclif/core';
import inquirer from 'inquirer';
import fs from 'node:fs/promises';
import path from 'node:path';
import { printSponsor } from '../util/sponsor';

const AvailableTemplates = [{ name: 'Kita + TypeScript', value: 'kita' }];

const DefaultInputs = {
  projectName: process.cwd().split('/').pop()!,
  directory: process.cwd(),
  template: 'kita',
  initGit: false
};

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
    initGit: Flags.boolean({
      char: 'g',
      description: 'Initializes a git repository.'
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

    const answers = await inquirer.prompt<typeof DefaultInputs>(
      [
        {
          type: 'input',
          name: 'projectName',
          message: 'What is the name of your project?',
          default: flags.name || DefaultInputs.projectName,
          when: !flags.yes,
          askAnswered: true
        },
        {
          type: 'input',
          name: 'directory',
          message: 'Where would you like to create your project?',
          default: flags.path || './' /* More readable */,
          when: !flags.yes,
          askAnswered: true,
          filter: (input) => path.resolve(input)
        },
        {
          type: 'list',
          name: 'template',
          message: 'Which template would you like to use?',
          default: flags.template || DefaultInputs.template,
          choices: [...AvailableTemplates, { name: 'Others', disabled: 'Coming soon', short: 'Others' }],
          when: !flags.yes,
          askAnswered: true
        },
        {
          type: 'confirm',
          name: 'initGit',
          message: 'Would you like to initialize a git repository?',
          default: flags.initGit || DefaultInputs.initGit,
          when: !flags.yes,
          askAnswered: true
        }
      ],
      DefaultInputs
    );

    const selectedProjectPath = path.resolve(answers.directory, answers.projectName);

    // copies the template to the selected directory
    await fs.cp(path.resolve(TemplatesDir, answers.template), selectedProjectPath, { recursive: true });

    console.log(answers);
  }
}
