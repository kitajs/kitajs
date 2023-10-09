# oclif-hello-world

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![GitHub license](https://img.shields.io/github/license/oclif/hello-world)](https://github.com/oclif/hello-world/blob/main/LICENSE)

<!-- toc -->

- [oclif-hello-world](#oclif-hello-world)
- [Usage](#usage)
- [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->

```sh-session
$ npm install -g @kitajs/cli
$ kita COMMAND
running command...
$ kita (--version)
@kitajs/cli/1.1.0 linux-x64 node-v20.8.0
$ kita --help [COMMAND]
USAGE
  $ kita COMMAND
...
```

<!-- usagestop -->

# Commands

<!-- commands -->

- [`kita autocomplete [SHELL]`](#kita-autocomplete-shell)
- [`kita build`](#kita-build)
- [`kita help [COMMANDS]`](#kita-help-commands)
- [`kita init`](#kita-init)

## `kita autocomplete [SHELL]`

display autocomplete installation instructions

```
USAGE
  $ kita autocomplete [SHELL] [-r]

ARGUMENTS
  SHELL  (zsh|bash|powershell) Shell type

FLAGS
  -r, --refresh-cache  Refresh cache (ignores displaying instructions)

DESCRIPTION
  display autocomplete installation instructions

EXAMPLES
  $ kita autocomplete

  $ kita autocomplete bash

  $ kita autocomplete zsh

  $ kita autocomplete powershell

  $ kita autocomplete --refresh-cache
```

_See code:
[@oclif/plugin-autocomplete](https://github.com/oclif/plugin-autocomplete/blob/v2.3.9/src/commands/autocomplete/index.ts)_

## `kita build`

Builds up all your routes into @kitajs/runtime.

```
USAGE
  $ kita build [-c <value>] [-r <value>] [--debug] [-d] [-s]

FLAGS
  -c, --config=<value>  Path to your config file
  -d, --dist            Imports code from the dist folder (needs manual transpiling)
  -r, --root=<value>    Root directory of your project
  -s, --source          Imports code from the source folder (needs tsx/ts-node registered)
  --debug               Prints full resolved config

DESCRIPTION
  Builds up all your routes into @kitajs/runtime.

EXAMPLES
  $ kita build
```

## `kita help [COMMANDS]`

Display help for kita.

```
USAGE
  $ kita help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for kita.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.2.20/src/commands/help.ts)_

## `kita init`

Creates a basic kita.config.js

```
USAGE
  $ kita init [-r <value>]

FLAGS
  -r, --root=<value>  Root directory of your project

DESCRIPTION
  Creates a basic kita.config.js

EXAMPLES
  $ kita init
```

<!-- commandsstop -->
