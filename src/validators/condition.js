const vm = require('vm')

function ConditionHandler (config, { ruler, query, data, injections }) {
  try {
    let script = this._script
    if (!script) {
      script = new vm.Script(config)
      this._script = script
    }

    const context = { ...injections, query, data }
    const result = script.runInNewContext(context)
    if(result) return null

    return 'the expression evaluated to a falsy value'
  } catch (error) {
    return error
  }
}

module.exports = ConditionHandler
