const yo = require('yo-yo')
const observable = require('../observable')
const start = require('../start')

const main = yo`<div></div>`
const data = {
  model: 0,
  effect: 'SCHEDULE_TICK'
}

const sources = start({
  init () { return data },
  update (model, action) {
    if (action === 'TICK') {
      return {
        model: (model + 1) % 60,
        effect: 'SCHEDULE_TICK'
      }
    }
    return {model}
  },
  view (model, actionsUp) {
    return yo`<div>${model}</div>`
  },
  run (effect) {
    if (effect === 'SCHEDULE_TICK') {
      let s = observable()
      setTimeout(() => {
        s('TICK')
        s(true) // call s.unSubscribe(onDataFunction)
      }, 1000)
      return s
    }
  }
})

sources.models().subscribe(m => console.log(m))
sources.views().subscribe(el => yo.update(main, el))
document.body.appendChild(main)
