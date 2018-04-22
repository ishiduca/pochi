'use strirct'
const test = require('tape')
const start = require('../start')

test('newly created app renders initial state', t => {
  const app = {
    init () { return {model: 1} },
    update (model) { return {model} },
    view (model) { return {model} }
  }
  const {views} = start(app)
  views().subscribe(view => {
    t.deepEqual(view, {model: 1})
    t.end()
  })
})

test('view observable will not emit a view if view function return null', t => {
  t.plan(1)
  const initialModel = {initial: true}
  const app = {
    init () { return {model: initialModel} },
    update (model) { return {model} },
    view (model) {
      t.ok(true)
      return null
    }
  }
  const {views} = start(app)
  views().subscribe(view => {
    t.false(view)
  })
})

test('view observable will not emit a view if view function return undefined', t => {
  t.plan(1)
  const initialModel = {initial: true}
  const app = {
    init () { return {model: initialModel} },
    update (model) { return {model} },
    view (model) {
      t.ok(true)
    }
  }
  const {views} = start(app)
  views().subscribe(view => {
    t.false(view)
  })
})
