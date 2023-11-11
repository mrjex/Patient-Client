// Rename to intermediaryDataTransmitter.js  (send from Map.vue to this file to map.js)

import { myFunc, initMap, exportFunc } from './map.js'
console.warn('In test.js')
myFunc()

// NOTE: 'initMap' does not enter watchPosition()

setTimeout(initMap, 10000)
setTimeout(initMap, 15000)
setTimeout(initMap, 20000)
// setTimeout(navigator.geolocation.clearWatch(1), 6000)

// Parallel Programming:
// 1. Run this program by using setInterval() each 1000ms
// 2. This program checks the content of the article 'radius-data' each second
// 3. If the content != previous content e.g when user changes radius value, then run initMap in map.js
