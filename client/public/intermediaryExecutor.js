// NOTE FOR DEVELOPERS: This script's purpose is only to excute or invoke fragments of javascript-files on the occurence of specified events
import { initMap, graphicalMap, calcRoute, userGlobalCoordinates, selectedDentalClinicMarker, directionsService, directionsRenderer, drawMap } from './maps/map-modes/nearby-map.js'

import {
  initSearchMap, calcRouteSearch, searchedPlace, selectedDentalClinicMarkerSearch, directionsServiceSearch, directionsRendererSearch, markerCoordinates, updateRadiusSearch
} from './maps/map-modes/search-map.js'
let zoomLevel = 12

function updateMap() { // nearby-map.js
  console.warn(graphicalMap)

  if (graphicalMap !== -1) {
    console.warn('Initialized')
    zoomLevel = graphicalMap.zoom
  } else {
    console.warn('Not initialized')
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

export { updateMap, updateTravelMode, updateSearchMap, updateTravelModeSearch, markerCoordinates, zoomLevel, updateRadiusSearch, drawMap }
