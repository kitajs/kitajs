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

Analyses your backend searching for routes and bakes it into the runtime.

```
USAGE
  $ kita build [-d | -s] [-c <value>] [-r <value>] [--print]

FLAGS
  -c, --config=<value>  Path to your kita.config.js file, if any.
  -d, --dist            Uses transpiled javascript code. {KitaConfig#dist=true}
  -r, --root=<value>    Custom root directory for your project. {KitaConfig#cwd}
  -s, --source          Uses source typescript code. Needs tsx/ts-node registered. {KitaConfig#dist=false}
  --print               Prints full resolved config

DESCRIPTION
  Analyses your backend searching for routes and bakes it into the runtime.

EXAMPLES
  Builds your backend to be used with tsx, ts-node or swc and uses a custom config file.

    $ kita build -s -c kita.config.js

  Builds your backend to be used with transpiled javascript code and uses a custom root directory.

    $ kita build -d -r packages/server
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
  -r, --root=<value>  Custom root directory for your project.

DESCRIPTION
  Creates a basic kita.config.js

EXAMPLES
  $ kita init
```

<!-- commandsstop -->
