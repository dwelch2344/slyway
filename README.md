oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg)](https://github.com/oclif/hello-world/blob/main/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g slyway
$ slyway COMMAND
running command...
$ slyway (--version)
slyway/0.0.1 darwin-arm64 node-v16.18.0
$ slyway --help [COMMAND]
USAGE
  $ slyway COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`slyway help [COMMAND]`](#slyway-help-command)
* [`slyway migrate [DIR]`](#slyway-migrate-dir)
* [`slyway plugins`](#slyway-plugins)
* [`slyway plugins:install PLUGIN...`](#slyway-pluginsinstall-plugin)
* [`slyway plugins:inspect PLUGIN...`](#slyway-pluginsinspect-plugin)
* [`slyway plugins:install PLUGIN...`](#slyway-pluginsinstall-plugin-1)
* [`slyway plugins:link PLUGIN`](#slyway-pluginslink-plugin)
* [`slyway plugins:uninstall PLUGIN...`](#slyway-pluginsuninstall-plugin)
* [`slyway plugins:uninstall PLUGIN...`](#slyway-pluginsuninstall-plugin-1)
* [`slyway plugins:uninstall PLUGIN...`](#slyway-pluginsuninstall-plugin-2)
* [`slyway plugins update`](#slyway-plugins-update)

## `slyway help [COMMAND]`

Display help for slyway.

```
USAGE
  $ slyway help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for slyway.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.14/src/commands/help.ts)_

## `slyway migrate [DIR]`

Migrate your database

```
USAGE
  $ slyway migrate [DIR] -h <value> -p <value> -d <value> -u <value> [-f]

FLAGS
  -d, --db=<value>    (required) port
  -f, --force
  -h, --host=<value>  (required) host
  -p, --port=<value>  (required) port
  -u, --user=<value>  (required) user

DESCRIPTION
  Migrate your database
```

## `slyway plugins`

List installed plugins.

```
USAGE
  $ slyway plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ slyway plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.1.1/src/commands/plugins/index.ts)_

## `slyway plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ slyway plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.

  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ slyway plugins add

EXAMPLES
  $ slyway plugins:install myplugin 

  $ slyway plugins:install https://github.com/someuser/someplugin

  $ slyway plugins:install someuser/someplugin
```

## `slyway plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ slyway plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ slyway plugins:inspect myplugin
```

## `slyway plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ slyway plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.

  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ slyway plugins add

EXAMPLES
  $ slyway plugins:install myplugin 

  $ slyway plugins:install https://github.com/someuser/someplugin

  $ slyway plugins:install someuser/someplugin
```

## `slyway plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ slyway plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.

EXAMPLES
  $ slyway plugins:link myplugin
```

## `slyway plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ slyway plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ slyway plugins unlink
  $ slyway plugins remove
```

## `slyway plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ slyway plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ slyway plugins unlink
  $ slyway plugins remove
```

## `slyway plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ slyway plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ slyway plugins unlink
  $ slyway plugins remove
```

## `slyway plugins update`

Update installed plugins.

```
USAGE
  $ slyway plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```
<!-- commandsstop -->
