'use strict'
const test = require('tape')
const start = require('../start')

test('initial state of model can be set in init', t => {
  const initialModel = {initial: true}
  const app = {
    init () { return {model: initialModel} },
    update (model, action) {
      t.is(model, initialModel, 'model passed to update is set by initial state')
      t.end()
      return {model}
    },
    view (model, dispatch) {
      dispatch(null)
      return {}
    }
  }
  start(app)
})

test('returning an effect in init emits the effect on the effects stream', t => {
  const expectedEffect = {type: 'WEEEEEE'}
  const app = {
    init () { return {effect: expectedEffect, model: 0} },
    update (model, action) { return {model} },
    view (model, dispatch) {
      dispatch(null)
      return {}
    },
    run () {}
  }
  start(app).effects().subscribe(effect => {
    t.is(effect, expectedEffect)
    t.end()
  })
})

test('stateful sources pool last value', t => {
  const app = {
    init () { return {model: 'model', effect: 'effect'} },
    update (model, action) { return {model} },
    view (modl, dispatch) {
//      dispatch(null)
      return '<div></div>'
    },
    run () {}
  }
  const {states, models, effects, views} = start(app)
  t.plan(4)
  process.nextTick(() => {
    states().subscribe(state => {
      t.deepEqual(state, {model: 'model', effect: 'effect'})
    })
    models().subscribe(model => {
      t.is(model, 'model')
    })
    effects().subscribe(effect => {
      t.is(effect, 'effect')
    })
    views().subscribe(view => {
      t.is(view, '<div></div>')
    })
  })
})
