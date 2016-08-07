const icon = require('../lib/icon')
const bookmarks = require('../lib/bookmarks')
const tabs = require('../lib/tabs')
const _ = require('../lib/utils')
const CelebrateSuccess = require('./celebrate_success')
const views = require('./views')

function setFrequency (frequency) {
  icon.enable(frequency)
  saveCurrentUrlPeriodicity(frequency)
  .then(CelebrateSuccess(frequency))
  .then(window.close)
}

module.exports = {
  setFrequency: setFrequency,
  select: function (e) {
    setFrequency(e.target.attributes['data-frequency'].value)
  },
  remove: () => {
    icon.disable()
    tabs.getCurrentUrlBookmarkId()
    .then((bookmarkId) => {
      if (bookmarkId) {
        bookmarks.removeById(bookmarkId)
      }
    })
    .then(window.close)
  },
  addNote: () => {
    views.showNoteView()
  },
  saveNote: () => {
   const note = document.querySelector('#note').value
    return tabs.getCurrentUrlBookmarkId()
    .then((bookmarkId) => {
      if (bookmarkId) {
        return bookmarks.updateNote(bookmarkId, note)
      } else {
        // create a bookmark with the default frequency and save the note
        icon.enable(frequency)
        return saveCurrentUrlPeriodicity()
        .then((bookmarkData) => bookmarks.updateNote(bookmarkData.id, note))
        .then(CelebrateSuccess(frequency))
      }
    })
    .then(window.close)
  }
}

const saveCurrentUrlPeriodicity = (frequency) => {
  return tabs.getCurrentUrlBookmarkData()
  .then((bookmarkData) => {
    let bookmarkId = bookmarkData && bookmarkData.id
    if (bookmarkId) {
      return bookmarks.updateFrequencyData(bookmarkId, bookmarkData.title, frequency)
    } else {
      return tabs.getActive()
      .then((tabData) => bookmarks.add(tabData.url, tabData.title, frequency) )
    }
  })
}
