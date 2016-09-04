# minirocket v1.0.0

[![CircleCI](https://circleci.com/gh/kt3k/minirocket.svg?style=svg)](https://circleci.com/gh/kt3k/minirocket)
[![codecov](https://codecov.io/gh/kt3k/minirocket/branch/master/graph/badge.svg)](https://codecov.io/gh/kt3k/minirocket)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

> Quick scaffold for cli tool development.

# Install

    npm install minirocket

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
const minirocket = require('minirocket')

minirocket({
  foo: argv.foo,
  bar: argv.bar,
  [argv._.[0]]: true
}, argv).on('no-action', action => {
  console.log(`No such action: ${action}`)
})
```

actions/foo.js:

```js
module.exports = () => console.log('foo!')
```

actions/bar.js:

```js
module.exports = ({name}) => console.log(`Hello, ${name}!`)
```

actions/baz.js:
```js
module.exports = () => console.log('baz')
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
const minirocket = require('minirocket')
```

## minirocket(actionDefinition, options)

- @param {object} actionDefinition The definition of the action selection
- @param {object} argv The argv which is passed to each action
- @param {object} options The options
- @param {string} [options.actions] The directory under which it look for the action files
- @return {Minirocket} Minirocket class instance

This invokes the action function with the given argv.

`actionDefinition` is an object. The each key should have a boolean value. The first key which has true (or truthy value) is chosen as the action name. If none of the keys have truthy values then it throws an error.

Then it look for the .js file under the `./actions` directory (this is configurable by the options.actions). If it finds the `actionName`.js, then evaluate it and invoke it as function with the argv as the first parameter, otherwise it emits 'no-action' event.

## no-action event

`no-action` event is emitted on `Minirocket` object with the value of the given action name.

# License

MIT
