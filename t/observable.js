'use strict'
const test = require('tape')
const observable = require('../observable')

test('var values = observable()', t => {
  const values = observable()
  t.is(values(), null, 'value() === null')
  t.end()
})

test('data = values(newData)', t => {
  const values = observable()
  const spy = []
  values.subscribe(newData => spy.push(newData))
  t.is(values(1), 1, 'values(1) === 1')
  t.is(values(null), null, 'values(null) === null')
  t.is(values(), null, 'values() === null')
  t.deepEqual(spy, [1, null], 'values publish data 2 times - 1, null')
  values(null)
  console.log('# case publish same data, listener do not catch event')
  t.deepEqual(spy, [1, null, null], 'values publish data 3 times - 1, null, nul')
  t.end()
})

test('listener = values.subscribe(function (newData) { ... })', t => {
  const values = observable(0)
  const spyA = []
  const spyB = []
  const listener = values.subscribe(v => spyA.push(v))
  values.subscribe(v => spyB.push(v))
  values(1)
  values(2)
  values.unSubscribe(listener)
  values(3)
  values(4)
  t.deepEqual(spyA, [1, 2], 'case unSubscribe listener, 2 times catch event')
  t.deepEqual(spyB, [1, 2, 3, 4], 'case do not unSubscribe listener, 4 times catch event')
  t.end()
})
