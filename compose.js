var defined = require('defined')
var observ = require('./observable')

module.exports = function compose (apps, template) {
  return {
    init: function () {
      return composeState(apps.map(function (app) {
        return defined(app.init(), {model: null})
      }))
    },
    update: function (models, actions) {
      return composeState(apps.map(function (app, i) {
        return typeof actions[i] === 'undefined'
          ? {model: models[i]}
          : defined(app.update(models[i], actions[i]), {model: models[i]})
      }))
    },
    view: function (models, actionsUp) {
      var up = function up (i) {
        return function (action) {
          actionsUp(item(action, i))
        }
      }
      return template(apps.map(function (app, i) {
        return app.view(models[i], up(i))
      }))
    },
    run: function (effects, sources) {
      if (effects == null) return
      var many = observ()
      var removes = []
      apps.forEach(function (app, i) {
        var actionsSource
        if (effects[i] == null) return
        if ((actionsSource = app.run(effects[i], sources)) == null) return
        var onSub = actionsSource.subscribe(function (action) {
          if (action === true) {
            actionsSource.unSubscribe(onSub)
            removes = removes.filter(function (onsub) { return onsub !== onSub })
            if (removes.length === 0) many(true)
          } else {
            many(apps.map(function (x) { return action }))
          }
        })
        removes.push(onSub)
      })
      return many
    }
  }
}

function composeState (states) {
  return {
    model: states.map(function (state) { return state.model }),
    effect: states.some(function (state) { return state.effect != null })
      ? states.map(function (state) { return state.effect }) : null
  }
}

function item (data, i) {
  var arry = []
  arry[i] = data
  return arry
}
