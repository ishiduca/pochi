var xtend = require('xtend')
var defined = require('defined')
var defaults = require('./defaults')
var observable = require('./observable')

module.exports = function start (app) {
  app = xtend(app)
  var init = defined(app.init, defaults.init)
  var update = defined(app.update, defaults.update)
  var view = defined(app.view, defaults.view)
  var run = defined(app.run, defaults.run)
  var actions = observable()
  var states = observable()
  var models = observable()
  var views = observable()
  var effects = observable()
  var effectActionsSources = observable()

  function actionsUp (action) { actions(action) }

  actions.subscribe(function (action) {
    states(update.call(app, states().model, action))
  })
  states.subscribe(function (state) {
    models(state.model)
    state.effect != null && effects(state.effect)
  })
  models.subscribe(difference(function (model) {
    var el = view.call(app, model, actionsUp)
    el != null && views(el)
  }))

  var notifys = {
    actions: actions,
    states: states,
    models: models,
    views: views,
    effects: effects,
    effectActionsSources: effectActionsSources
  }
  var sources = {}
  Object.keys(notifys).forEach(function (name) {
    sources[name] = (
      ['states', 'models', 'effects', 'views'].indexOf(name) !== -1
    ) ? replayLastValue(notifys[name]) : function () { return notifys[name] }
  })

  effects.subscribe(function (effect) {
    var actionsSource = run.call(app, effect, sources)
    actionsSource != null && effectActionsSources(actionsSource)
  })

  effectActionsSources.subscribe(function (actionsSource) {
    var onActionsSourceSub = actionsSource.subscribe(function (action) {
      if (action === true) actionsSource.unSubscribe(onActionsSourceSub)
      else actions(action)
    })
  })

  process.nextTick(function () {
    states(init.call(app))
  })

  return xtend(sources, {stop: stop})

  function stop () {
    Object.keys(notifys).forEach(function (name) {
      notifys[name].unSubscribe()
    })
  }
}

function difference (f, data) {
  return function (newData) {
    if (typeof newData !== 'undefined' && data !== newData) {
      data = newData
      f(newData)
    }
  }
}

function replayLastValue (notify) {
  var lastValue
  var onSub = notify.subscribe(function (value) {
    lastValue = value
  })

  return function listenWithLastValue () {
    var proxy = observable()
    notify.subscribe(proxy)
    notify.unSubscribe(onSub)
    process.nextTick(function () {
      if (typeof lastValue !== 'undefined') proxy(lastValue)
    })
    return proxy
  }
}
