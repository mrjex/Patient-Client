// NOTE FOR DEVELOPERS: This script's purpose is only to excute or invoke fragments of javascript-files on the occurence of specified events

import { initMap, graphicalMap, calcRoute, userGlobalCoordinates, selectedDentalClinicMarker, directionsService, directionsRenderer } from './map.js'
import {
  initSearchMap, calcRouteSearch, searchedPlace, selectedDentalClinicMarkerSearch, directionsServiceSearch, directionsRendererSearch, markerCoordinates, searchReferenceCoordinatesData
} from './search-map.js'
let zoomLevel = 12

function updateMap() { // map.js
  if (graphicalMap !== undefined) { // The map isn't defined the first time this method is executed
    zoomLevel = graphicalMap.zoom
  }

  setTimeout(initMap, 500)
}

function updateSearchMap(delay) { // search-map.js
  setTimeout(initSearchMap, delay)
}

function updateTravelMode() {
  setTimeout(calcRoute(userGlobalCoordinates, selectedDentalClinicMarker, directionsService, directionsRenderer), 500)
}

function updateTravelModeSearch() {
  setTimeout(calcRouteSearch(searchedPlace.geometry.location, selectedDentalClinicMarkerSearch, directionsServiceSearch, directionsRendererSearch), 500)
}

/*
function updateRadiusSearchIntermediary() {
  setTimeout(updateRadiusSearch(selectedRadius, infowindowContentSearchReference, infowindowSearchReference), 500)
}
*/

updateMap()
updateSearchMap(0, -1) // NOTE: If search-UI doesn't show, try fixing/terminating eventListeners

export { updateMap, zoomLevel, updateTravelMode, updateSearchMap, updateTravelModeSearch, markerCoordinates, searchReferenceCoordinatesData }
