var defined = require('defined')

module.exports = function observable (data) {
  data = defined(data, null)
  var listeners = []

  function accessor (newData) {
    data = defined(newData, data)
    if (typeof newData !== 'undefined') {
      listeners.forEach(function (listener) {
        listener(newData)
      })
    }
    return data
  }
  accessor.subscribe = function subscribe (listener) {
    return listeners.push(listener) && listener
  }
  accessor.unSubscribe = function unSubscribe (listener) {
    listeners = listener == null
      ? [] : listeners.filter(function (f) { return f !== listener })
    return listener
  }
  return accessor
}
