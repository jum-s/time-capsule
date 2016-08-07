const i18n = require('../lib/i18n')
const buildElement = require('../lib/element')
const actions = require('./actions')
const footerEl = document.querySelector('#footer')
const optionsViewEl = document.querySelector('#optionsView')
const { matrix } = require('./matrix')

// build div.remove  + click event listener
const neverEl = buildElement({
  tagName: 'div',
  className: 'never',
  text: i18n('never'),
  appendTo: footerEl,
  attributes: {
    title: '[Suppr]',
  },
  onClick: actions.remove
})

// let the time to .custom element to be added before
setTimeout(() => {
  neverEl.place = {
    row: matrix.length,
    column: 0
  }
  matrix.push([neverEl])
}, 100)

buildElement({
  id: 'addNote',
  tagName: 'a',
  text: i18n('add_note'),
  appendTo: optionsViewEl,
  attributes: {
    title: '[n]',
  },
  onClick: actions.addNote
})

saveNote = document.querySelector('#saveNote')
saveNote.textContent = i18n('save')
saveNote.addEventListener('click', actions.saveNote)
