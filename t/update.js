'use strict'
const test = require('tape')
const start = require('../start')

//test('models returned by update are emitted by the model observable', t => {
//  const initialModel = {initial: true}
//  const expectedModel = {count: 0}
//  const app = {
//    init () { return {model: initialModel} },
//    update (model) { return {model: expectedModel} },
//    view (model, actionsUp) {
//      actionsUp(true)
//      return {model}
//    }
//  }
//  const {models} = start(app)
//  const spy = []
//  models().subscribe(model => spy.push(model))
//
//  setTimeout(() => {
//    t.deepEqual(spy, [initialModel], JSON.stringify(spy))
//    t.end()
//  }, 10)
//})
//
test('model observable will not emit a model if is a duplicatte', t => {
  t.plan(1)
  const initialModel = {initial: true}
  const app = {
    init () { return {model: initialModel} },
    update (model) { return {model} },
    view (model, actionsUp) {
      actionsUp()
      return {model}
    }
  }
  const {models} = start(app)
  const spy = []
  models().subscribe(model => spy.push(model))

  setTimeout(() => {
    t.deepEqual(spy, [initialModel], JSON.stringify(spy))
    t.end()
  }, 10)
})

test('effects observable will not emit an effect if update returns a null effect', t => {
  t.plan(1)
  const initialModel = {initial: true}
  const app = {
    init () { return {model: initialModel} },
    update (model, action) {
      t.ok(model)
      return {model: model, effect: null}
    },
    view (model, actionsUp) {
      actionsUp(null)
    },
    run (effect) {
      t.fail()
    }
  }
  const {effects} = start(app)
  effects().subscribe(effect => t.fail())
})

test('effects observable will not emit an effect if update returns an undefined effect', t => {
  t.plan(1)
  const initialModel = {initial: true}
  const app = {
    init () { return {model: initialModel} },
    update (model, action) {
      t.ok(model)
      return {model: model, effect: void(0)}
    },
    view (model, actionsUp) {
      actionsUp(null)
    },
    run (effect) {
      t.fail()
    }
  }
  const {effects} = start(app)
  effects().subscribe(effect => t.fail())

})
