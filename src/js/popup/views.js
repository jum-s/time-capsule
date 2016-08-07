const optionsViewEl = document.querySelector('#optionsView')
const typingViewEl = document.querySelector('#typingView')
const noteViewEl = document.querySelector('#noteView')
const noteDisplayEl = document.querySelector('#noteDisplay')
const typingEl = document.querySelector('#typing')
const helpEl = require('./build_help')
const lastKeys = require('./last_keys')

var lastViewWasOptions = true

module.exports = {
  showFrequencyTypingView: () => {
    hide(optionsViewEl)
    hide(noteViewEl)
    show(typingViewEl)
    show(noteDisplayEl)
    typingEl.textContent = lastKeys.getMatchingPart()
    lastViewWasOptions = false
  },
  showFrequencyOptionsView: () => {
    hide(typingViewEl)
    hide(noteViewEl)
    show(optionsViewEl)
    typingEl.textContent = ''
    lastViewWasOptions = true
  },
  showFrequencySelectionSuccess: (frequency) => {
    // helpEl shouldn't be hidden when the last view was the typing view
    // as it makes the text jump
    if (lastViewWasOptions) {
      hide(helpEl)
    }
    hide(optionsViewEl)
    show(typingViewEl)
    typingEl.textContent = frequency
    typingEl.classList.add('success')
  },
  showNoteView: () => {
    hide(typingViewEl)
    hide(optionsViewEl)
    show(noteViewEl)
    hide(noteDisplayEl)
    noteEl = document.querySelector('#note')
    // Selecting on next tick so that the key triggering showNoteView
    // isn't catched as an input to the textarea
    setTimeout(noteEl.select.bind(noteEl), 0)
  }
}

const show = (el) => el.style.display = 'block'
const hide = (el) => el.style.display = 'none'
