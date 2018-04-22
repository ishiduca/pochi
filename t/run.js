'use strivt'
const test = require('tape')
const start = require('../start')
const observable = require('../observable')

test('returning an effect from update triggers the run function', t => {
  const initialModel = {initial: true}
  const expectedEffect = {type: 'EXPECTED_EFFECT'}
  const app = {
    init () { return {model: initialModel} },
    update (model, action) { return {model: model, effect: expectedEffect} },
    view (model, actionsUp) {
      actionsUp(true)
      return {}
    },
    run (effect) {
      t.is(effect, expectedEffect, 'effect is equivalent to effect object returned in update')
      t.end()
    }
  }
  start(app)
})

test('returning an effect from init triggers the run function', t => {
  const expectedEffect = {type: 'EXPECTED_EFFECT'}
  const app = {
    init () { return {effect: expectedEffect} },
    update (model, action) { return {model: model, effect: expectedEffect} },
    view (model, actionsUp) {
      actionsUp(true)
      return {}
    },
    run (effect) {
      t.is(effect, expectedEffect, 'effect is equivalent to effect object returned in init')
      t.end()
    }
  }
  start(app)
})

test('returning an action from effect triggers the update function', t => {
  const initialModel = {initial: true}
  const expectedEffect = {type: 'EXPECTED_EFFECT'}
  const expectedAction = {type: 'EXPECTED_ACTION'}
  const app = {
    init () { return {model: initialModel, effect: expectedEffect} },
    update (model, action) {
      t.is(action, expectedAction, 'Action passed to update is equivalent to the one returned in run')
      t.end()
      return {model}
    },
    view (model, actionsUp) {
      return {}
    },
    run (effect) {
      const actionsSource = observable()
      process.nextTick(() => {
        actionsSource(expectedAction)
        actionsSource(true)
      })
      return actionsSource
    }
  }
  start(app)
})

test('returning an action from effect triggers the update function', t => {
  const initialModel = {initial: true}
  const expectedEffect = {type: 'EXPECTED_EFFECT'}
  const expectedAction = {type: 'EXPECTED_ACTION'}
  const app = {
    init () { return {model: initialModel, effect: expectedEffect} },
    update (model, action) {
      t.is(action, expectedAction, 'Action passed to update is equivalent to the one returned in run')
      t.end()
      return {model}
    },
    view (model, actionsUp) {
      return {}
    },
    run (effect) {
      const actionsSource = observable()
      process.nextTick(() => {
        actionsSource(expectedAction)
        actionsSource(true)
      })
      return actionsSource
    }
  }
  start(app)
})

test('returning an action from effect emits actions on the action stream', t => {
  const initialModel = {initial: true}
  const expectedEffect = {type: 'EXPECTED_EFFECT'}
  const expectedAction = {type: 'EXPECTED_ACTION'}
  const app = {
    init () { return {model: initialModel, effect: expectedEffect} },
    update (model, action) { return {model} },
    view (model, actionsUp) { return {} },
    run (effect) {
      const actionsSource = observable()
      process.nextTick(() => {
        actionsSource(expectedAction)
        actionsSource(true)
      })
      return actionsSource
    }
  }
  start(app).actions().subscribe(action => {
    t.is(action, expectedAction)
    t.end()
  })
})

test('actions stream passed to run emits actions', t => {
  const initialModel = {initial: true}
  const expectedEffect = {type: 'EXPECTED_EFFECT'}
  const expectedAction = {type: 'EXPECTED_ACTION'}
  const app = {
    init () { return {model: initialModel, effect: expectedEffect} },
    update (model, action) { return {model} },
    view (model, actionsUp) { return {} },
    run (effect, sources) {
      sources.actions().subscribe(action => {
        t.is(action, expectedAction)
        t.end()
      })
      const actionsSource = observable()
      process.nextTick(() => {
        actionsSource(expectedAction)
        actionsSource(true)
      })
      return actionsSource
    }
  }
  start(app)
})

test('effectActions stream will not emit an action if run returns an undefined stream', t => {
  t.plan(1)
  const initialModel = {initial: true}
  const app = {
    init () { return {model: initialModel, effect: true} },
    update (model, action) { return {model} },
    view (model, actionsUp) { return {} },
    run (effect, sources) { t.ok(effect) }
  }
  start(app).effectActionsSources().subscribe(model => t.fail())
})
