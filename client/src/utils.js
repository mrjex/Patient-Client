// Check if current button or a new button is selected
function checkIfDropdownPressed(currentMode, previousMode) {
  return (currentMode && (currentMode !== previousMode))
}

// Initialize scripts basd on their sources
function createHTMLScriptElement(scriptSource, appendToDOM) {
  const scriptElement = document.createElement('script')
  scriptElement.type = 'module'
  scriptElement.src = scriptSource

  if (appendToDOM === true) {
    document.head.prepend(scriptElement)
  }
}

export { checkIfDropdownPressed, createHTMLScriptElement }
