const yo = require('yo-yo')
const xtend = require('xtend')
const observable = require('../observable')
const start = require('../start')
const compose = require('../compose')

const creator = name => value => ({type: name, payload: value})

const updateHelper = mapper => (model, action) => (
  mapper[action.type] == null ? {model} : mapper[action.type](model, action.payload)
)
const runHelper = mapper => (effect, sources) => (
  mapper[effect.type] == null ? null : mapper[effect.type](effect.payload, sources)
)

const inc = creator('inc')
const dec = creator('dec')
const beyondInc = creator('beyondInc')
const BEYOND_INC = creator('BEYOND_INC')

const app = {
  update: updateHelper({
    inc (model, action) { return {model: model + 1} },
    dec (model, action) { return {model: model - 1} },
    beyondInc (model, action) { return {model, effect: BEYOND_INC()} }
  }),
  run: runHelper({
    BEYOND_INC (effect, sources) {
      const source = observable()
      process.nextTick(() => {
        source(inc())
        source(true)
      })
      return source
    }
  }),
  view (model, actionsUp) {
    return yo`
      <div>
        <p>model: ${model}</p>
        <button onclick=${e => actionsUp(inc())}>inc</button>
        <button onclick=${e => actionsUp(dec())}>dec</button>
        <button onclick=${e => actionsUp(beyondInc())}>beyond inc</button>
      </div>
    `
  }
}

const template = (views, i) => yo`
  <div>
    ${views.map(view => yo`
      <section class=${`app-${i}`}>
        ${view}
      </section>
    `)}
  </div>
`

const main = yo`<div></div>`

const {models, views} = start(compose([
  xtend(app, {init () { return {model: 0} }}),
  xtend(app, {init () { return {model: 10} }}),
  xtend(app, {init () { return {model: 100} }})
], template))

models().subscribe(m => console.log(m))
views().subscribe(el => yo.update(main, el))

document.body.appendChild(main)
