'use strirct'
const test = require('tape')
const start = require('../start')
const observable = require('../observable')

test('Calling dispatch triggers update function with action passed to dispatch', t => {
  const initialModel = {initial: true}
  const expectedAction = {type: 'DISPATCHED'}
  const app = {
    init () { return {model: initialModel} },
    update (model, action) {
      t.is(action, expectedAction, 'action passed to update is the action pased to dispatch')
      t.end()
      return {model: model}
    },
    view (moel, dispatch) {
      dispatch(expectedAction)
      return {}
    }
  }
  start(app)
})

test('Delaying call to dispatch triggers update function with action passed to dispatch', t => {
  const initialModel = {initial: true}
  const expectedAction = {type: 'DISPATCHED'}
  const app = {
    init () { return {model: initialModel} },
    update (model, action) {
      t.is(action, expectedAction, 'action passed to update is the action passed to dispatch')
      t.end()
    },
    view (model, dispatch) {
      setTimeout(() => dispatch(expectedAction), 10)
      return {}
    }
  }
  start(app)
})

test('Calling dispatch emits actions on the action stream', t => {
  const initialModel = {initial: true}
  const expectedAction = {type: 'DISPATCHED'}
  const app = {
    init () { return {model: initialModel} },
    update (model, action) {
      return {model: model}
    },
    view (model, dispatch) {
      setTimeout(() => dispatch(expectedAction), 10)
      return {}
    }
  }
  start(app).actions().subscribe(action => {
    t.is(action, expectedAction)
    t.end()
  })
})
