'use strict'
const test = require('tape')
const start = require('../start')

test('calling stop() ends actions observable', t => {
  const initialModel = {initial: true}
  const app = {
    init () { return {model: initialModel} },
    update (model, action) {
      t.is(model, initialModel, 'model passed to update is set by initial state')
      t.end()
      return {model}
    },
    view (model) {
      return {model}
    }
  }
  const {actions, stop} = start(app)
  const spy = []
  actions().subscribe(spy.push.bind(spy))
  stop()
  setTimeout(() => {
    t.is(spy.length, 0, 'Actions observable ends with no emitted actions')
    t.end()
  }, 10)
})

test('calling stop() ends effects observable', t => {
  const initialModel = {initial: true}
  const app = {
    init () { return {model: initialModel} },
    update (model, action) {
      t.is(model, initialModel, 'model passed to update is set by initial state')
      t.end()
      return {model}
    },
    view (model) {
      return {model}
    }
  }
  const {effects, stop} = start(app)
  const spy = []
  effects().subscribe(spy.push.bind(spy))
  stop()
  setTimeout(() => {
    t.is(spy.length, 0, 'Effects observable ends with no emitted effects')
    t.end()
  }, 10)
})

test('calling stop() ends views observable', t => {
  const initialModel = {initial: true}
  const app = {
    init () { return {model: initialModel} },
    update (model, action) {
      t.is(model, initialModel, 'model passed to update is set by initial state')
      t.end()
      return {model}
    },
    view (model) {
      return {model}
    }
  }
  const {views, stop} = start(app)
  const spy = []
  views().subscribe(spy.push.bind(spy))
  stop()
  setTimeout(() => {
    t.is(spy.length, 0, 'Views observable ends with no emitted views')
    t.end()
  }, 10)
})

test('calling stop() ends models observable', t => {
  const initialModel = {initial: true}
  const app = {
    init () { return {model: initialModel} },
    update (model, action) {
      t.is(model, initialModel, 'model passed to update is set by initial state')
      t.end()
      return {model}
    },
    view (model) {
      return {model}
    }
  }
  const {models, stop} = start(app)
  const spy = []
  models().subscribe(spy.push.bind(spy))
  stop()
  setTimeout(() => {
    t.is(spy.length, 0, 'Models observable ends with no emitted models')
    t.end()
  }, 10)
})

test('calling stop() ends effectActions observable', t => {
  const initialModel = {initial: true}
  const app = {
    init () { return {model: initialModel} },
    update (model, action) {
      t.is(model, initialModel, 'model passed to update is set by initial state')
      t.end()
      return {model}
    },
    view (model) {
      return {model}
    }
  }
  const {effectActionsSources, stop} = start(app)
  const spy = []
  effectActionsSources().subscribe(spy.push.bind(spy))
  stop()
  setTimeout(() => {
    t.is(spy.length, 0, 'EffectActions observable ends with no emitted effectActionsSources')
    t.end()
  }, 10)
})
