const _ = require('./utils')
const promisify = require('./promisify_chrome')
const get = promisify(chrome.bookmarks.get, chrome.bookmarks)
const create = promisify(chrome.bookmarks.create, chrome.bookmarks)
const update = promisify(chrome.bookmarks.update, chrome.bookmarks)
const remove = promisify(chrome.bookmarks.remove, chrome.bookmarks)
const search = promisify(chrome.bookmarks.search, chrome.bookmarks)
const getSubTree = promisify(chrome.bookmarks.getSubTree, chrome.bookmarks)
// let bookmarks_init use it too without rebuilding it
chrome.bookmarks.createAsync = create
const init = require('./bookmarks_init')
const bookmarkTitle = require('./bookmark_title')
const nextVisitIsToday = require('./next_visit_is_today')

const API = {
  getById: (id)=> get(id).then(_.first),
  search: search,
  updateFrequencyData: (id, title, frequency) => {
    return update(id, { title: bookmarkTitle.format(title, frequency) })
  },
  updateNote: (id, note) => {
    return API.getById(id)
    .then((bookmarkData) => {
      return update(id, {title: bookmarkTitle.updateNote(bookmarkData.title, note)})
    })
  },
  removeById: remove,
  parse: (bookmarkData) => {
    const data = bookmarkTitle.parse(bookmarkData.title)
    data.id = bookmarkData.id
    return data
  }
}

module.exports = API

// The init function needs to be called only once, given that even if the bookmark
// folder gets deleted, the folder id remains valid: newly created bookmarks
// will trigger the folder to be re-created

// store the promise
API.waitForFolder = init()
.then((folder) => {
  const { id:folderId } = folder

  API.folder = folderId

  API.isInFolder = (bookmarkData) => bookmarkData && bookmarkData.parentId === folderId

  API.add = (url, title, frequency) => {
    return create({
      parentId: folderId,
      url: url,
      title: bookmarkTitle.format(title, frequency)
    })
  }

  API._getByUrl = (url) => {
    if (!url) {
      throw new Error('url is missing')
    }
    return search({url: url})
    .then((res) => res.filter(API.isInFolder)[0] )
  }

  // Could possibly be extracted to become specific to background
  // and not overload the popup
  API._getTodaysBookmarksData = () => {
    return getSubTree(folderId)
    .then((res) => {
      return res[0].children
      .map(API.parse)
      .filter(nextVisitIsToday)
    })
  }
})

const WaitForFolder = require('./wait_for_folder')(API)
// functions that depend on the bookmark folder id availability
// but need to be directly defined/accessible on the API object
API.getByUrl = WaitForFolder('getByUrl')
API.getTodaysBookmarksData = WaitForFolder('getTodaysBookmarksData')
