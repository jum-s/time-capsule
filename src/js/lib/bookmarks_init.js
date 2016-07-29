const promisify = require('./promisify_chrome')
const getTree = promisify(chrome.bookmarks.getTree, chrome.bookmarks)
const _ = require('../lib/utils')
const create = chrome.bookmarks.createAsync

const folderName = 'Browse Periodically bookmarks'

module.exports = function () {
  return getTree()
  .then(findMatch)
  .then(createFolderIfMissing)
  .catch(_.ErrorRethrow('initFolder'))
}

const findMatch = function (array) {
  for (let node of array) {
    if (matchingNode(node)) {
      return node
    } else if (node.children) {
      let childreMatch = findMatch(node.children)
      if (childreMatch) {
        return childreMatch
      }
    }
  }

  return false
}

const matchingNode = (node) => node.title === folderName

const createFolderIfMissing = function (match) {
  if (match) {
    console.log('bookmark folder exist')
    return match
  } else {
    return create({ title: folderName })
    .then(function (newFolder) {
      console.log('added folder: ' + newFolder.title)
      return newFolder
    })
  }
}