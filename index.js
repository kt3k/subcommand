const dispatch = require('cli-dispatch')
const callsite = require('callsite')
const EventEmitter = require('events').EventEmitter
const path = require('path')
const util = require('util')

const callersDir = () => path.dirname(callsite()[2].getFileName())

function Minirocket () {
  EventEmitter.call(this)
}

util.inherits(Minirocket, EventEmitter)

/**
 * @param {object} actionDefinition The action definition
 * @param {object} argv The argv paremeter
 * @param {object} options The options
 * @return {Minirocket}
 */
module.exports = (actionDefinition, argv, options) => {
  options = options || {}

  const minirocket = new Minirocket()

  if (typeof actionDefinition !== 'object') {
    throw new Error('actionDefinition have to be an object')
  }

  const action = Object.keys(actionDefinition).filter(key => actionDefinition[key])[0]

  if (!action) {
    throw new Error('No action is available: ' + Object.keys(actionDefinition))
  }

  dispatch(action, argv, {actions: options.actions, base: callersDir()}).on('no-action', action => {
    minirocket.emit('no-action', action)
  })

  return minirocket
}
