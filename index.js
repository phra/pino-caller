'use strict'

const NODEJS_VERSION = parseInt(process.version.slice(1).split('.')[0], 10)
const DEFAULT_STACKTRACE_OFFSET = NODEJS_VERSION && NODEJS_VERSION > 6 ? 4 : 5
const DEFAULT_LINE_OFFSET = 7
const { symbols } = require('pino')
const { asJsonSym } = symbols

function traceCaller (pinoInstance, {stackTraceOffset = 0, lineOffset = 0} = {}) {
  function get (target, name) {
    return name === asJsonSym ? asJson : target[name]
  }

  function asJson (...args) {
    args[0] = args[0] || Object.create(null)
    args[0].caller = Error().stack.split('\n')[stackTraceOffset + DEFAULT_STACKTRACE_OFFSET].substr(lineOffset + DEFAULT_LINE_OFFSET)
    return pinoInstance[asJsonSym].apply(this, args)
  }

  return new Proxy(pinoInstance, { get })
}

module.exports = traceCaller
