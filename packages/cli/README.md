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
  <a href="https://kita.js.org/discord"><img src="https://img.shields.io/discord/1216165027774595112?logo=discord&logoColor=white&color=%237289da" alt="Discord"></a>
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

* [Usage](#usage)
* [Commands](#commands)
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

<br />

# Usage

<!-- usage -->

```sh-session
$ npm install -g @kitajs/cli
$ kita COMMAND
running command...
$ kita (--version|-v)
@kitajs/cli/1.1.36 linux-x64 node-v20.12.1
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
- [`kita create`](#kita-create)
- [`kita help [COMMAND]`](#kita-help-command)
- [`kita init`](#kita-init)
- [`kita plugins`](#kita-plugins)
- [`kita plugins add PLUGIN`](#kita-plugins-add-plugin)
- [`kita plugins:inspect PLUGIN...`](#kita-pluginsinspect-plugin)
- [`kita plugins install PLUGIN`](#kita-plugins-install-plugin)
- [`kita plugins link PATH`](#kita-plugins-link-path)
- [`kita plugins remove [PLUGIN]`](#kita-plugins-remove-plugin)
- [`kita plugins reset`](#kita-plugins-reset)
- [`kita plugins uninstall [PLUGIN]`](#kita-plugins-uninstall-plugin)
- [`kita plugins unlink [PLUGIN]`](#kita-plugins-unlink-plugin)
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
[@oclif/plugin-autocomplete](https://github.com/oclif/plugin-autocomplete/blob/v3.0.13/src/commands/autocomplete/index.ts)_

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

_See code: [src/commands/build.ts](https://github.com/kitajs/kitajs/blob/v1.1.36/src/commands/build.ts)_

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

_See code: [src/commands/config.ts](https://github.com/kitajs/kitajs/blob/v1.1.36/src/commands/config.ts)_

## `kita create`

Scaffolds a new project with Kita

```
USAGE
  $ kita create [-n <value>] [-d <value>] [-t kita|kita-jsx] [-y]

FLAGS
  -d, --dir=<value>        The directory to create the project in.
  -n, --name=<value>       The name of the project.
  -t, --template=<option>  The template to use.
                           <options: kita|kita-jsx>
  -y, --yes                Skips the prompts and uses the defaults.

DESCRIPTION
  Scaffolds a new project with Kita

EXAMPLES
  Scaffolds a project called mybackend.

    $ kita create -n mybackend
```

_See code: [src/commands/create.ts](https://github.com/kitajs/kitajs/blob/v1.1.36/src/commands/create.ts)_

## `kita help [COMMAND]`

Display help for kita.

```
USAGE
  $ kita help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for kita.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.0.20/src/commands/help.ts)_

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

_See code: [src/commands/init.ts](https://github.com/kitajs/kitajs/blob/v1.1.36/src/commands/init.ts)_

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

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.0.7/src/commands/plugins/index.ts)_

## `kita plugins add PLUGIN`

Installs a plugin into kita.

```
USAGE
  $ kita plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into kita.

  Uses bundled npm executable to install plugins into /home/hzk/.local/share/kita

  Installation of a user-installed plugin will override a core plugin.

  Use the KITA_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the KITA_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ kita plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ kita plugins add myplugin

  Install a plugin from a github url.

    $ kita plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ kita plugins add someuser/someplugin
```

## `kita plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ kita plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

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

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.0.7/src/commands/plugins/inspect.ts)_

## `kita plugins install PLUGIN`

Installs a plugin into kita.

```
USAGE
  $ kita plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into kita.

  Uses bundled npm executable to install plugins into /home/hzk/.local/share/kita

  Installation of a user-installed plugin will override a core plugin.

  Use the KITA_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the KITA_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ kita plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ kita plugins install myplugin

  Install a plugin from a github url.

    $ kita plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ kita plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.0.7/src/commands/plugins/install.ts)_

## `kita plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ kita plugins link PATH [-h] [--install] [-v]

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

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.0.7/src/commands/plugins/link.ts)_

## `kita plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ kita plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

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
  $ kita plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.0.7/src/commands/plugins/reset.ts)_

## `kita plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ kita plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

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
[@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.0.7/src/commands/plugins/uninstall.ts)_

## `kita plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ kita plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

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

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.0.7/src/commands/plugins/update.ts)_

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

_See code: [src/commands/reset.ts](https://github.com/kitajs/kitajs/blob/v1.1.36/src/commands/reset.ts)_

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

_See code: [src/commands/watch.ts](https://github.com/kitajs/kitajs/blob/v1.1.36/src/commands/watch.ts)_

<!-- commandsstop -->

<br />
