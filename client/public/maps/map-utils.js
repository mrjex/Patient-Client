// This script is the generalization of 'map.js' and 'search-map.js' and is executed at initialization of both scripts
/* eslint-disable no-undef */

// let graphicalMap
// let service
// let userMarker
// let selectedRadius = 10000

// let directionsService
// let directionsRenderer
// let selectedDentalClinicMarker

/*
function launchMapUtils(mapMode, markerPosition) {
  if (confirmExecutionConditions(mapMode)) {
    initializeDirectionServices()
    initializeMap(markerPosition)
  }
}
*/

// Each map-mode script is solely executed under certain conditions
function confirmExecutionConditions(mapMode) {
  const pathArray = window.location.href.split('/')
  const lastSubDomainPath = pathArray[pathArray.length - 1]
  return (lastSubDomainPath === 'map' && document.getElementById('mode-data').innerHTML === mapMode)
}

/*
function initializeDirectionServices() {
  directionsService = new google.maps.DirectionsService()
  directionsRenderer = new google.maps.DirectionsRenderer()
}
*/

/*
async function initializeMap(mapMode, markerPosition) {
  if (mapMode === 'NEARBY') {
    // @ts-ignore
    const { Map } = await google.maps.importLibrary('maps')
    graphicalMap = new Map(document.getElementById('map'), {
      zoom: zoomLevel,
      center: markerPosition, // Export user's global coordinates from 'map.js'
      mapId: 'DEMO_MAP_ID'
    })
  } else {
    graphicalMap = new google.maps.Map(document.getElementById('map'), {
      center: markerPosition,
      zoom: 13,
      mapTypeControl: false
    })
  }
}
*/
export { confirmExecutionConditions }
