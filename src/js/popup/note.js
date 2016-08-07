const i18n = require('../lib/i18n')
const noteEl = document.querySelector('#note')
const noteDisplayEl = document.querySelector('#noteDisplay')
const addNoteEl = document.querySelector('#addNote')
const optionsViewEl = document.querySelector('#periodicityOptions')
const nav = require('./nav')

module.exports = (note) => {
  noteEl.value = note
  noteDisplayEl.textContent = note
  addNoteEl.textContent = i18n('edit_note')
  nav.set('note')
}
