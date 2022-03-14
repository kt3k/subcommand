# @kt3k/subcommand v0.1.0

[![CircleCI](https://circleci.com/gh/kt3k/minirocket.svg?style=svg)](https://circleci.com/gh/kt3k/minirocket)
[![codecov](https://codecov.io/gh/kt3k/minirocket/branch/master/graph/badge.svg)](https://codecov.io/gh/kt3k/minirocket)

> Utility for dispatching subcommand based on filename

# Install

    npm install @kt3k/subcommand

# Usage

First set up the directory like the following:

```
bin/
├── main.js
└── actions
    ├── foo.js
    ├── bar.js
    └── baz.js
```

Then in main.js:

```js
const argv = require('minimist')(process.argv.slice(2))
const subcommand = require('@kt3k/subcommand')

subcommand(__dirname, {
  foo: argv.foo,
  bar: argv.bar,
  [argv._.[0]]: true
}, actionFunc => {
  actionFunc(argv)
}).on('no-action', action => {
  console.log(`No such action: ${action}`)
})
```

actions/foo.js:

```js
module.exports = () => console.log("foo!");
```

actions/bar.js:

```js
module.exports = ({ name }) => console.log(`Hello, ${name}!`);
```

actions/baz.js:

```js
module.exports = () => console.log("baz");
```

Then, main.js works like the following:

    $ node main.js --foo
    foo!
    $ node main.js --bar --name John
    Hello, John!
    $ node main.js baz
    baz!
    $ node main.js spam
    No such action: spam

# API

```js
const subcommand = require("@kt3k/subcommand");
```

## subcommand(dir, actionDefinition, options, callback)

- @param {string} dir The directory to look up actions
- @param {object} actionDefinition The definition of the action selection
- @param {object} options The options
- @param {Function} callback The callback of the action
- @param {string} [options.actions] The directory under which it look for the
  action files. Default is `{minirocket's callers dir}/actions`.
- @return {Minirocket} Minirocket class instance

This invokes the action function with the given argv.

`actionDefinition` is an object. The each key should have a boolean value. The
first key which has true (or truthy value) is chosen as the action name. If none
of the keys have truthy values then it throws an error.

Then it look for the .js file under the `./actions` directory (this is
configurable by the options.actions). If it finds the `actionName`.js, then
`require`s it and passes it to the given callback function. If it cannot find
it, then it emits 'no-action' event.

## no-action event

`no-action` event is emitted on `Minirocket` object with the value of the given
action name.

# Example

- [bulbo](https://github.com/kt3k/bulbo)
  - https://github.com/kt3k/bulbo/blob/master/src/bin/bulbo.js

# License

MIT
