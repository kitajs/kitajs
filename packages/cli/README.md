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
  <a title="Install size" target="_blank" href="https://packagephobia.com/result?p=@kitajs/cli"><img alt="Bundlephobia" src="https://packagephobia.com/badge?p=@kitajs/cli"></a>
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
  - [`kita b`](#kita-b)
  - [`kita build`](#kita-build)
  - [`kita c`](#kita-c)
  - [`kita config`](#kita-config)
  - [`kita help [COMMANDS]`](#kita-help-commands)
  - [`kita i`](#kita-i)
  - [`kita init`](#kita-init)
  - [`kita plugins`](#kita-plugins)
  - [`kita plugins:install PLUGIN...`](#kita-pluginsinstall-plugin)
  - [`kita plugins:inspect PLUGIN...`](#kita-pluginsinspect-plugin)
  - [`kita plugins:install PLUGIN...`](#kita-pluginsinstall-plugin-1)
  - [`kita plugins:link PLUGIN`](#kita-pluginslink-plugin)
  - [`kita plugins:uninstall PLUGIN...`](#kita-pluginsuninstall-plugin)
  - [`kita plugins:uninstall PLUGIN...`](#kita-pluginsuninstall-plugin-1)
  - [`kita plugins:uninstall PLUGIN...`](#kita-pluginsuninstall-plugin-2)
  - [`kita plugins update`](#kita-plugins-update)
  - [`kita r`](#kita-r)
  - [`kita reset`](#kita-reset)
  - [`kita w`](#kita-w)
  - [`kita watch`](#kita-watch)

<br />

# Usage

<!-- usage -->

```sh-session
$ npm install -g @kitajs/cli
$ kita COMMAND
running command...
$ kita (--version|-v)
@kitajs/cli/1.1.24 linux-x64 node-v20.9.0
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
- [`kita config`](#kita-config)
- [`kita help [COMMANDS]`](#kita-help-commands)
- [`kita init`](#kita-init)
- [`kita plugins`](#kita-plugins)
- [`kita plugins:install PLUGIN...`](#kita-pluginsinstall-plugin)
- [`kita plugins:inspect PLUGIN...`](#kita-pluginsinspect-plugin)
- [`kita plugins:install PLUGIN...`](#kita-pluginsinstall-plugin-1)
- [`kita plugins:link PLUGIN`](#kita-pluginslink-plugin)
- [`kita plugins:uninstall PLUGIN...`](#kita-pluginsuninstall-plugin)
- [`kita plugins reset`](#kita-plugins-reset)
- [`kita plugins:uninstall PLUGIN...`](#kita-pluginsuninstall-plugin-1)
- [`kita plugins:uninstall PLUGIN...`](#kita-pluginsuninstall-plugin-2)
- [`kita plugins update`](#kita-plugins-update)
- [`kita reset`](#kita-reset)
- [`kita watch`](#kita-watch)

## `kita autocomplete [SHELL]`

Display autocomplete installation instructions.

```
USAGE
  $ kita autocomplete [SHELL] [-r]

ARGUMENTS
  SHELL  (zsh|bash|powershell) Shell type

FLAGS
  -r, --refresh-cache  Refresh cache (ignores displaying instructions)

DESCRIPTION
  Display autocomplete installation instructions.

EXAMPLES
  $ kita autocomplete

  $ kita autocomplete bash

  $ kita autocomplete zsh

  $ kita autocomplete powershell

  $ kita autocomplete --refresh-cache
```

_See code:
[@oclif/plugin-autocomplete](https://github.com/oclif/plugin-autocomplete/blob/v3.0.1/src/commands/autocomplete/index.ts)_

## `kita build`

Analyses your backend searching for routes and bakes it into the runtime.

```
USAGE
  $ kita build [-c <value>] [--cwd <value>] [-D | -d] [-r | ]

BUILD FLAGS
  -D, --[no-]dts  Skips emitting declaration files (d.ts).
  -d, --dry-run   Skips generation process and only type-checks your files.
  -r, --reset     Removes previous generated files before each build.

GLOBAL FLAGS
  -c, --config=<value>  Path to your kita.config.js file, if any.
      --cwd=<value>     Sets the current working directory for your command.

DESCRIPTION
  Analyses your backend searching for routes and bakes it into the runtime.

EXAMPLES
  Builds your backend with a custom config file.

    $ kita build -c kita.config.js

  Fast checks your backend for errors without generating the runtime.

    $ kita build -d
```

_See code: [src/commands/build.ts](https://github.com/kitajs/kitajs/blob/v1.1.24/src/commands/build.ts)_

## `kita config`

Prints the full resolved configuration file

```
USAGE
  $ kita config [-c <value>] [--cwd <value>] [-r]

FLAGS
  -r, --[no-]raw  Prints a JSON string instead of a pretty printed object.

GLOBAL FLAGS
  -c, --config=<value>  Path to your kita.config.js file, if any.
      --cwd=<value>     Sets the current working directory for your command.

DESCRIPTION
  Prints the full resolved configuration file

EXAMPLES
  Builds your backend with a custom config file.

    $ kita config -c kita.config.js
```

_See code: [src/commands/config.ts](https://github.com/kitajs/kitajs/blob/v1.1.24/src/commands/config.ts)_

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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.0.6/src/commands/help.ts)_

## `kita init`

Creates a basic kita.config.js

```
USAGE
  $ kita init [-c <value>] [--cwd <value>]

GLOBAL FLAGS
  -c, --config=<value>  Path to your kita.config.js file, if any.
      --cwd=<value>     Sets the current working directory for your command.

DESCRIPTION
  Creates a basic kita.config.js

EXAMPLES
  $ kita init
```

_See code: [src/commands/init.ts](https://github.com/kitajs/kitajs/blob/v1.1.24/src/commands/init.ts)_

## `kita plugins`

List installed plugins.

```
USAGE
  $ kita plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ kita plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.1.8/src/commands/plugins/index.ts)_

## `kita plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ kita plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -s, --silent   Silences yarn output.
  -v, --verbose  Show verbose yarn output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ kita plugins add

EXAMPLES
  $ kita plugins add myplugin

  $ kita plugins add https://github.com/someuser/someplugin

  $ kita plugins add someuser/someplugin
```

## `kita plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ kita plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ kita plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.1.8/src/commands/plugins/inspect.ts)_

## `kita plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ kita plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -s, --silent   Silences yarn output.
  -v, --verbose  Show verbose yarn output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ kita plugins add

EXAMPLES
  $ kita plugins install myplugin

  $ kita plugins install https://github.com/someuser/someplugin

  $ kita plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.1.8/src/commands/plugins/install.ts)_

## `kita plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ kita plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ kita plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.1.8/src/commands/plugins/link.ts)_

## `kita plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ kita plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ kita plugins unlink
  $ kita plugins remove

EXAMPLES
  $ kita plugins remove myplugin
```

## `kita plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ kita plugins reset
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.1.8/src/commands/plugins/reset.ts)_

## `kita plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ kita plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ kita plugins unlink
  $ kita plugins remove

EXAMPLES
  $ kita plugins uninstall myplugin
```

_See code:
[@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.1.8/src/commands/plugins/uninstall.ts)_

## `kita plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ kita plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ kita plugins unlink
  $ kita plugins remove

EXAMPLES
  $ kita plugins unlink myplugin
```

## `kita plugins update`

Update installed plugins.

```
USAGE
  $ kita plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.1.8/src/commands/plugins/update.ts)_

## `kita reset`

Resets your runtime in an attempt to fix any issues.

```
USAGE
  $ kita reset [-c <value>] [--cwd <value>]

GLOBAL FLAGS
  -c, --config=<value>  Path to your kita.config.js file, if any.
      --cwd=<value>     Sets the current working directory for your command.

DESCRIPTION
  Resets your runtime in an attempt to fix any issues.

EXAMPLES
  Resets your runtime

    $ kita reset
```

_See code: [src/commands/reset.ts](https://github.com/kitajs/kitajs/blob/v1.1.24/src/commands/reset.ts)_

## `kita watch`

Watch for changes in your source code and rebuilds the runtime.

```
USAGE
  $ kita watch [-c <value>] [--cwd <value>] [-D | -d] [-r | ] [-i <value>]

BUILD FLAGS
  -D, --[no-]dts  Skips emitting declaration files (d.ts).
  -d, --dry-run   Skips generation process and only type-checks your files.
  -r, --reset     Removes previous generated files before each build.

GLOBAL FLAGS
  -c, --config=<value>  Path to your kita.config.js file, if any.
      --cwd=<value>     Sets the current working directory for your command.

WATCH FLAGS
  -i, --ignore=<value>...  Comma separated directories to ignore when watching for changes.

DESCRIPTION
  Watch for changes in your source code and rebuilds the runtime.

EXAMPLES
  Watches your source with a custom config file.

    $ kita watch -c kita.config.js

  Watches your source and only emits errors.

    $ kita watch -d
```

_See code: [src/commands/watch.ts](https://github.com/kitajs/kitajs/blob/v1.1.24/src/commands/watch.ts)_

<!-- commandsstop -->

<br />
