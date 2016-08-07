const _ = require('../lib/utils')
const times = require('./times')
const separator = ' |ᐒ '
const pattern = /\s\/\/\s([\d\.]{1,3})([HDWMYT])\s(.*)$/
const halfAMinute = times.T/2
const { defaultFrequency } = require('../lib/config')

function format (title, frequency = defaultFrequency) {
  const [ trueTitle, oldFrequency, oldNextVisit, note ] = title.split(separator)
  // Use ISOString as it's nicer for readability
  const nextVisit = getNextVisit(frequency)
  return buildTitle(trueTitle, frequency, nextVisit, note)
}

function getNextVisit (frequency) {
  const { num, unit } = parseFrequency(frequency)
  let delay = num*times[unit]
  // Prevent scheduling a tab in less than 30 secondes
  // as a very short delay could mean 🔥 BROWSER TABS INFINITE LOOP HELL 🔥
  if (delay < halfAMinute) {
    delay = halfAMinute
  }
  const time = _.now() + delay
  return new Date(time).toISOString()
}

function parse (title) {
  const data = parseTitle(title)
  if (data.frequency) {
    return {
      frequency: data.frequency,
      // epoch time number should take less memory and computation power
      // than an ISO time string in the bookmark index
      nextVisit: new Date(data.nextVisit).getTime(),
      note: data.note
    }
  }
}

function parseFrequency (frequency) {
  if (!frequency) return
  return {
    // accepting floats
    num: parseFloat(frequency.slice(0, -1)),
    unit: frequency.slice(-1)
  }
}

const updateNote = (title, note) => update(title, {note: note})

function update (title, updateData) {
  let data = parseTitle(title)
  data = Object.assign(data, updateData)
  return buildTitleFromObject(data)
}

function parseTitle (fullTitle) {
  const [ title, frequency, nextVisit, note ] = fullTitle.split(separator)
  return {
    title: title,
    frequency: frequency,
    nextVisit: nextVisit,
    note: note
  }
}

function buildTitle (title, frequency, nextVisit, note = '') {
  return `${title}${separator}${frequency}${separator}${nextVisit}${separator}${note}`
}

function buildTitleFromObject (data) {
  const { title, frequency, nextVisit, note } = data
  return buildTitle(title, frequency, nextVisit, note)
}

module.exports = {
  format: format,
  parse: parse,
  updateNote: updateNote
}