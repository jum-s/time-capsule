module.exports = {
  show: (el, display = 'block') => el.style.display = display,
  hide: (el) => el.style.display = 'none'
}