// NOTE FOR DEVELOPERS: This script's purpose is only to excute or invoke fragments of javascript-files on the occurence of specified events

import { initMap, graphicalMap, calcRoute, userGlobalCoordinates, selectedDentalClinicMarker, directionsService, directionsRenderer } from './map.js'
let zoomLevel = 7

function updateMap() {
  if (graphicalMap !== undefined) { // The map isn't defined the first time this method is executed
    zoomLevel = graphicalMap.zoom
  }

  setTimeout(initMap, 500)
}

function updateTravelMode() {
  setTimeout(calcRoute(userGlobalCoordinates, selectedDentalClinicMarker, directionsService, directionsRenderer), 500)
}

updateMap()

export { updateMap, zoomLevel, updateTravelMode }
