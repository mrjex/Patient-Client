import { confirmExecutionConditions, currentRadius, callbackUtils } from '../map-utils.js'

// TODO: Export variables from map-utils.js to this script and search-map.js

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
    console.warn('in nearby-map.js')

    // Alternative to implement for 'GPS' feature in video: navigator.geolocation.watchPosition(async position => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords
      userGlobalCoordinates = { lat: latitude, lng: longitude }
    })

    setTimeout(drawMap, 1000) // Account for the delay to assign/find 'userGlobalCoordinates' in the method above
  }
}

async function drawMap() {
  const { Map } = await google.maps.importLibrary('maps')
  const { AdvancedMarkerElement } = await google.maps.importLibrary('marker')
  initiateMap(Map, AdvancedMarkerElement)
}

function generateInfoWindow(place, marker) {
  const ratingString = place.rating ? 'Rating: ' + place.rating + ` by ${place.user_ratings_total} users` : ''
  const infowindow = new google.maps.InfoWindow()

  infowindow.setContent(
    `<strong class="header">${place.name}</strong>
    <p>
    Adress: ${place.vicinity} <br>
    ${ratingString}
    </p>
    <style>
    .header {
      font-weight: 1000
    }
    </style>`
  )
  infowindow.open(nearbyMap, marker)
}

function listenForMarkerClickNearbyMode(marker, place) {
  google.maps.event.addListener(marker, 'click', function () {
    selectedDentalClinicMarker = marker.position

    generateInfoWindow(place, marker)
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
  updateRadius()
}

function initiateDirectionsComponents() {
  directionsService = new google.maps.DirectionsService()
  directionsRenderer = new google.maps.DirectionsRenderer()
  directionsRenderer.setMap(nearbyMap)
}

function updateRadius() {
  service = new google.maps.places.PlacesService(nearbyMap)
  service.nearbySearch(getNearbyRequest(), callbackUtils) // PREV: ,callback
}

// Specify conditions for query of markers
function getNearbyRequest() {
  return {
    location: userGlobalCoordinates,
    radius: currentRadius, // selectedRadius
    type: ['dentist']
  }
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
  directionsService, directionsRenderer, updateRadius, drawMap, changeTravelMode, deselectClinicMarker, listenForMarkerClickNearbyMode
}
