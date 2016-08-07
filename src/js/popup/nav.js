const i18n = require('../lib/i18n')
const navEl = document.querySelector('nav')
const showPeriodicityOptionsEl = document.querySelector('#showPeriodicityOptions')
const showNoteEl = document.querySelector('#showNote')
const { show, hide } = require('./visibility')
const views = require('./views')

function showNav () {
  show(navEl, 'flex')
  showPeriodicityOptionsEl.textContent = i18n('periodicity')
  showNoteEl.textContent = i18n('note')
}

const API = {
  set: (tabName) => {
    showNav()
    if (tabName === 'note') {
      showPeriodicityOptionsEl.classList.remove('selected')
      showNoteEl.classList.add('selected')
      views.showNoteReadingView()
    } else {
      showNoteEl.classList.remove('selected')
      showPeriodicityOptionsEl.classList.add('selected')
      views.showFrequencyOptionsView()
    }
  }
}

showPeriodicityOptionsEl.addEventListener('click', API.set.bind(null, 'periodicity'))
showNoteEl.addEventListener('click', API.set.bind(null, 'note'))

module.exports = API