import { confirmExecutionConditions, currentRadius, generateInfoWindowUtils, updateRadiusUtils } from '../map-utils.js'
// performNearbyQuery

/* eslint-disable no-undef */
let nearbyMap = -1
let service

let userGlobalCoordinates = -1

let directionsService
let directionsRenderer
let selectedDentalClinicMarker = null

let currentTravelMode = 'DRIVING'

const defaultZoomLevel = 12

async function initMap() {
  if (confirmExecutionConditions('NEARBY')) {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords
      userGlobalCoordinates = { lat: latitude, lng: longitude }
    })

    setTimeout(drawNearbyMap, 1000) // Account for the delay to assign/find 'userGlobalCoordinates' in the method above
  }
}

async function drawNearbyMap() {
  const { Map } = await google.maps.importLibrary('maps')
  const { AdvancedMarkerElement } = await google.maps.importLibrary('marker')
  initiateMap(Map, AdvancedMarkerElement)
}

function listenForMarkerClickNearbyMode(marker, place) {
  google.maps.event.addListener(marker, 'click', function () {
    selectedDentalClinicMarker = marker.position

    generateInfoWindowUtils(place, marker)
    calcRoute(userGlobalCoordinates, selectedDentalClinicMarker, directionsService, directionsRenderer)
  })
}

function calcRoute(userGlobalCoordinates, dentistDestination, directionsService, directionsRenderer) {
  if (dentistDestination !== null) {
    const request = {
      origin: userGlobalCoordinates,
      destination: dentistDestination,
      travelMode: google.maps.TravelMode[currentTravelMode]
    }
    directionsService.route(request, function (response, status) {
      if (status === 'OK') {
        directionsRenderer.setDirections(response)
      }
    })
  }
}

function createUserMarker(AdvancedMarkerElement) {
  const userIcon = document.createElement('img') // NOTE: Refactor in map-utils.js
  userIcon.src = 'https://i.ibb.co/cFB7cMR/User-Marker-Icon.png'

  // The marker that represents user's current global position
  const marker = new AdvancedMarkerElement({
    map: nearbyMap,
    position: userGlobalCoordinates,
    content: userIcon,
    title: 'Your Position'
  })
  console.log(marker)
}

function getZoomLevel() {
  return nearbyMap === -1 ? defaultZoomLevel : nearbyMap.zoom
}

function initiateMap(Map, AdvancedMarkerElement) {
  nearbyMap = new Map(document.getElementById('map'), {
    zoom: getZoomLevel(),
    center: userGlobalCoordinates,
    mapId: 'DEMO_MAP_ID'
  })

  createUserMarker(AdvancedMarkerElement)
  initiateDirectionsComponents()

  updateRadiusUtils(service, nearbyMap, userGlobalCoordinates, currentRadius)
}

function initiateDirectionsComponents() {
  directionsService = new google.maps.DirectionsService()
  directionsRenderer = new google.maps.DirectionsRenderer()
  directionsRenderer.setMap(nearbyMap)
}

function changeTravelMode(newMode) {
  currentTravelMode = newMode
}

function deselectClinicMarker() {
  selectedDentalClinicMarker = null
}

initMap()
export {
  initMap, nearbyMap, calcRoute, userGlobalCoordinates, selectedDentalClinicMarker,
  directionsService, directionsRenderer, drawNearbyMap, changeTravelMode, deselectClinicMarker, listenForMarkerClickNearbyMode
}
