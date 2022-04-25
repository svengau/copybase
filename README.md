[![npm][npm]][npm-url]
[![node][node]][node-url]
[![downloads][downloads]][downloads-url]

## About

Copybase is a database tool that helps you quickly copy a database. Simply define your databases config in a `.copybaserc.yaml`, and start copying or backuping them with a simple command line:

```sh
copybase copy staging local
```

```sh
copybase backup prod
```

## Getting Started

### Installation

```sh
# install copybase globally
npm i -g copybase
# with yarn:
yarn global add copybase

# or locally
npm i copybase
# with yarn:
yarn add copybase
```

### Configuration

Copybase uses [cosmiconfig](https://github.com/davidtheclark/cosmiconfig), so you just need to create a file `.copybaserc.yaml` (or `.copybaserc.json`, `.copybaserc.js`) with the following sample config:

```yaml
backup:
  # output folder when you run the backup command
  folder: .backup
# list all databases you want to work with
databases:
  # sample config for localhost
  local:
    database: demo
    protocol: postgresql
    hostname: 127.0.0.1
    port: 54321
    username: demo
    password: password

  # sample config for a remote database, uring uri
  staging:
    uri: postgresql://demo:staging.example.com@localhost:54322/demo
```

### Usage

```
Usage: copybase [options] [command]

Copy quickly a database

Options:
-V, --version output the version number
-h, --help display help for command

Commands:
copy [options]          <fromDatabase> <toDatabase> Copy a database
list:tables [options]   <database> List all tables in database
backup [options]        <database> Backup a database
help [command]          display help for command
```

[npm]: https://img.shields.io/npm/v/copybase.svg
[npm-url]: https://npmjs.com/package/copybase
[node]: https://img.shields.io/node/v/copybase.svg
[node-url]: https://nodejs.org
[deps]: https://david-dm.org/webpack-contrib/copybase.svg
[deps-url]: https://david-dm.org/webpack-contrib/copybase
[tests]: http://img.shields.io/travis/webpack-contrib/copybase.svg
[tests-url]: https://travis-ci.org/webpack-contrib/copybase
[downloads]: https://img.shields.io/npm/dt/copybase.svg
[downloads-url]: https://npmjs.com/package/copybase
