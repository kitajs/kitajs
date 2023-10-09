<p align="center">
   <b>Using this package?</b> Please consider <a href="https://github.com/sponsors/arthurfiorette" target="_blank">donating</a> to support my open source work ❤️
  <br />
  <sup>
   Help @kitajs/cli grow! Star and share this amazing repository with your friends and co-workers!
  </sup>
</p>

<br />

<p align="center" >
  <a href="https://kita.js.org" target="_blank" rel="noopener noreferrer">
    <img src="https://kita.js.org/logo.png" width="180" alt="Kita JS logo" />
  </a>
</p>

<br />

<div align="center">
  <a title="MIT license" target="_blank" href="https://github.com/kitajs/kitajs/blob/master/LICENSE"><img alt="License" src="https://img.shields.io/github/license/kitajs/kitajs"></a>
  <a title="Codecov" target="_blank" href="https://app.codecov.io/gh/kitajs/kitajs"><img alt="Codecov" src="https://img.shields.io/codecov/c/github/kitajs/kitajs?token=ML0KGCU0VM"></a>
  <a title="NPM Package" target="_blank" href="https://www.npmjs.com/package/@kitajs/cli"><img alt="Downloads" src="https://img.shields.io/npm/dw/@kitajs/cli?style=flat"></a>
  <a title="Bundle size" target="_blank" href="https://bundlephobia.com/package/@kitajs/cli@latest"><img alt="Bundlephobia" src="https://img.shields.io/bundlephobia/minzip/@kitajs/cli/latest?style=flat"></a>
  <a title="Last Commit" target="_blank" href="https://github.com/kitajs/kitajs/commits/master"><img alt="Last commit" src="https://img.shields.io/github/last-commit/kitajs/kitajs"></a>
  <a href="https://github.com/kitajs/kitajs/stargazers"><img src="https://img.shields.io/github/stars/kitajs/kitajs?logo=github&label=Stars" alt="Stars"></a>
</div>

<br />
<br />

<h1>🪛 KitaJS CLI</h1>

<p align="center">
  <code>@kitajs/cli</code> is a command line interface for the  <a href="https://kita.js.org" target="_blank">KitaJS</a> routing meta framework.
  <br />
  <br />
</p>

<br />

<!-- toc -->

- [Usage](#usage)
- [Commands](#commands)
<!-- tocstop -->

- [Usage](#usage)
- [Commands](#commands)
  - [`kita autocomplete [SHELL]`](#kita-autocomplete-shell)
  - [`kita build`](#kita-build)
  - [`kita help [COMMANDS]`](#kita-help-commands)
  - [`kita init`](#kita-init)

<br />

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

<br />

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
  $ kita build [-s] [-c <value>] [--print] [-d]

FLAGS
  -c, --config=<value>  Path to your kita.config.js file, if any.
  -d, --dry-run         Skips generation process. Useful for testing your code.
  -s, --import-source   Maps all imports directly to source files instead of the usual dist folder. Needs tsx/ts-node to
                        work.
  --print               Prints full resolved config

DESCRIPTION
  Analyses your backend searching for routes and bakes it into the runtime.

EXAMPLES
  Builds your backend with a custom config file.

    $ kita build -c kita.config.js

  Fast checks your backend for errors without generating the runtime.

    $ kita build -d
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

<br />
