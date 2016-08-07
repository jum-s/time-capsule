const _ = require('../lib/utils')
const bookmarks = require('../lib/bookmarks')

const optionsEl = require('./periodicity_options')
const addCustomFrequencyButton = require('./add_custom_frequency_button')(optionsEl)
require('./footer')
const updateNextVisit = require('./next_visit')
const displayNote = require('./note')

const { defaultFrequency } = require('../lib/config')

module.exports = function buildPopup (bookmarkData) {
  if (bookmarks.isInFolder(bookmarkData)) {
    const parsedData = bookmarks.parse(bookmarkData)
    if (parsedData) {
      const { nextVisit, frequency, note } = parsedData
      updateNextVisit(nextVisit)
      // catch float frequencies (that are necessarly custom) before the select function
      // tries to use document.querySelector on an invalid selector (due to the dot)
      if (floatFrequency(frequency)) {
        addCustomFrequencyButton()
      } else {
        select(frequencySelector(frequency))
      }
      if (note && note.length > 0) {
        displayNote(note)
      }
    } else {
      console.error('bookmark in folder but impossible to parse data', bookmarkData)
      select('.never')
    }
  } else {
    select(frequencySelector(defaultFrequency))
  }
}

function select (selector) {
  const el = document.querySelector(selector)
  if (el) {
    el.classList.add('selected')
  } else {
    addCustomFrequencyButton()
  }
}

const frequencySelector = (frequency) => `.frequency-${frequency}`
const floatFrequency = (frequency) => /\./.test(frequency)
