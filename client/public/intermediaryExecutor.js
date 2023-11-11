// NOTE FOR DEVELOPERS: This script's purpose is only to excute or invoke fragments of javascript-files on the occurence of specified events

import { initMap } from './map.js'
// NOTE: Fix bug where the zoom is restored to its initial one when changing range
// --> In the map declaration in 'map.js', set the zoom attribute the same value it was before 'updateMap()' was executed
// --> SOLUTION: Create a global variable
function updateMap() {
  setTimeout(initMap, 2000) // NOTE: Fix this bug so that 0ms also works --> Prevent automatic execution on start of application --> Global variable counter
  console.warn('In intermediaryExecutor.js')
}

updateMap()

export { updateMap }
