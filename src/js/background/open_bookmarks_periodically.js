const _ = require('../lib/utils')
const bookmarks = require('../lib/bookmarks')
const schedule = require('./schedule')
const oneDay = require('../lib/times').D
const dayEnd = require('../lib/day_end')

function openTodaysBookmarks () {
  // this function as the monopoly on setting the day end
  // and every one else simply reading from it
  dayEnd.set()
  bookmarks.getTodaysBookmarksData()
  .then((todaysBookmarks) => {
    todaysBookmarks.forEach(schedule.schedule.bind(null, _.now()))
    return
  })
  .catch(_.Error('openTodaysBookmarks'))
}

openTodaysBookmarks()
setInterval(openTodaysBookmarks, oneDay)

chrome.bookmarks.onCreated.addListener(reschedule)
chrome.bookmarks.onRemoved.addListener(reschedule)
chrome.bookmarks.onChanged.addListener(reschedule)

function reschedule (id, bookmark) {
  // Weirdly, the bookmark data is incomplete there: notably, it misses its id
  bookmark.id = id
  schedule.cancelPending(id)
  schedule.scheduleUnparsedBookmark(bookmark)
}
