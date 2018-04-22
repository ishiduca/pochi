# pochi

using "observable" instead of "pull-stream" on the ELMish architecture.

```js
var yo = require('yo-yo')
var obsereval = require('pochi/observable')
var start = require('pochi/start')

var sources = start({
  init: function () {
    return {
      model: 0,
      effect: 'SCHEDULE_TICK'
    }
  },
  update: function (model, action) {
    if (action === 'TICK') {
      return {
        model: (model + 1) % 60,
        effect: 'SCHEDULE_TICK'
      }
    }
    return {model: model}
  },
  view: function (model, actionsUp) {
    return yo`
      <div>
        <p>${model}</p>
      </div>
    `
  },
  run (effect, sources) {
    if (effect === 'SCHEDULE_TICK') {
      var actionsSource = observable()
      setTimeout(function () {
        actionsSource('TICK')
        actionsSource(true) // call actionsSource.unSubscribe(Func)
      }, 1000)
      return actionsSource
    }
  }
})

var main = yo`<div></div>`
sources.views().subscribe(function (view) {
  yo.update(main, view)
})

document.body.appendChild(main)
```
