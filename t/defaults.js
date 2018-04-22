'use strirct'
const test = require('tape')
const start = require('../start')
const observable = require('../observable')

test('defaultInit', t => {
  t.plan(1)
  const expectedModel = null
  start({
    update (model) {
      t.notOk(true, 'should not update state')
    },
    view (model) {
      t.is(model, expectedModel, 'init model is expected')
    },
    run (effect) {
      t.notOk(true, 'should not run effect')
    }
  })
})

test('defaultUpdate', t => {
  const expectedModel = {initial: true}
  const initialState = {
    model: expectedModel,
    effect: 'INITIALIZE'
  }
  const {models} = start({
    init () { return initialState },
    run (effect) {
      t.is(effect, initialState.effect, 'effect received')
      const actionsSource = observable()
      process.nextTick(() => {
        actionsSource('ACTION1')
        actionsSource('ACTION2')
        actionsSource('ACTION3')
        actionsSource(true)
      })
      return actionsSource
    }
  })
  const m = models()
  const onSubModels = m.subscribe(model => {
    t.is(model, expectedModel, 'initial model is expected')
    process.nextTick(() => t.end())
    m.unSubscribe(onSubModels)
  })
})

test('defaultView', t => {
  const {views} = start()
  views().subscribe(view => {
    t.notOk(true, 'did not expect to receive default empty view')
  })
  process.nextTick(() => t.end())
})

test('defaultRun', t => {
  const expectedActions = [
    'ACTION1', 'ACTION2', 'ACTION3'
  ]
  const initialState = {
    model: true,
    effect: 'INITIALIZE'
  }
  const {actions} = start({
    init () { return initialState },
    view (model, actionsUp) {
      expectedActions.forEach(action => {
        actionsUp(action)
      })
    }
  })
  const spy = []
  actions().subscribe(action => spy.push(action))
  process.nextTick(() => {
    t.deepEqual(spy, expectedActions, 'actions are the same')
    t.end()
  })
})

test('defaultApp', t => {
  t.ok(start(), 'undefined app has sources')
  t.end()
})
