const promisify = require('./promisify_chrome')

get = promisify(chrome.storage.sync.get, chrome.storage.sync)
set = promisify(chrome.storage.sync.set, chrome.storage.sync)

module.exports = {
  get: function (key) {
    return get(key)
    .then((res) => res[key] )
  },
  set: function (key, value) {
    const setObject = {}
    setObject[key] = value
    return set(setObject)
  }
}