// import { confirmExecutionConditions } from '../map-utils.js'

// TODO: Export variables from map-utils.js to this script and search-map.js

/* eslint-disable no-undef */
let graphicalMap = -1
let service

let userGlobalCoordinates = -1
let selectedRadius

let directionsService
let directionsRenderer
let selectedDentalClinicMarker

const defaultZoomLevel = 12
// let xObj

async function initMap() {
  const pathArray = window.location.href.split('/')
  const lastSubDomainPath = pathArray[pathArray.length - 1]

  if (lastSubDomainPath === 'map' && document.getElementById('mode-data').innerHTML === 'NEARBY') { // confirmExecutionConditions('NEARBY')
    console.warn('in nearby-map.js')

    // --------------------------------------
    /*
    xObj = {
      userCoordinatesTest: 10,
      aListener: function (val) {},
      set a(val) {
        this.userCoordinatesTest = val
        this.aListener(val)
      },
      get a() {
        return this.userCoordinatesTest
      },
      registerListener: function (listener) {
        this.aListener = listener
      }
    }

    xObj.registerListener(function (val) {
      // alert('Value of x.a changed to ' + val)
      console.warn('-------------')
      console.warn('value of xObj.a changed to ' + val)
      console.warn(userGlobalCoordinates)
      console.warn('-------------')
    })

    // xObj.a = 28
    */
    // --------------------------------------

    navigator.geolocation.watchPosition(async position => { // Alternative: '.navigator.geolocation.getCurrentPosition(position => {' for instant retrieval of 'userGlobalCoordinates'
      const { latitude, longitude } = position.coords
      userGlobalCoordinates = { lat: latitude, lng: longitude }
      // xObj.a = { lat: latitude, lng: longitude }
    })

    setTimeout(drawMap, 3000) // Account for the delay to assign/find 'userGlobalCoordinates' in the method above

    // Current error - SOLUTIONS:
    // 1) Increase the delay value
    // 2) Wait until 'userGlobalCoordinates' is assigned and then invoke 'drawMap()'

    // 2) Potential solution:
    // 1) timeInterval() + boolean --> exit once variable is assigned
    // 2) While loop + check if variable is assigned

    // Variable change listener
    /*
    xObj = {
      userCoordinatesTest: 10,
      aListener: function (val) {},
      set a(val) {
        this.userCoordinatesTest = val
        this.aListener(val)
      },
      get a() {
        return this.userCoordinatesTest
      },
      registerListener: function (listener) {
        this.aListener = listener
      }
    }

    xObj.registerListener(function (val) {
      // alert('Value of x.a changed to ' + val)
      console.warn('value of xObj.a changed to ' + val)
    })

    xObj.a = 21
    */
  }
}

async function drawMap() {
  const { Map } = await google.maps.importLibrary('maps')
  const { AdvancedMarkerElement } = await google.maps.importLibrary('marker')
  initiateMap(Map, AdvancedMarkerElement)
}

function callback(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (let i = 0; i < results.length; i++) {
      createMarker(results[i])
    }
  }
}

function createMarker(place) {
  const marker = new google.maps.Marker({
    map: graphicalMap,
    position: place.geometry.location
  })

  google.maps.event.addListener(marker, 'click', function () {
    selectedDentalClinicMarker = marker.position

    const ratingString = place.rating ? 'Rating: ' + place.rating + ` by ${place.user_ratings_total} users` : ''
    // console.warn(place.photos[0].getUrl()) // NOTE: Some dentists have pics and some not

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
    infowindow.open(graphicalMap, marker)

    calcRoute(userGlobalCoordinates, selectedDentalClinicMarker, directionsService, directionsRenderer)
    // calcRoute(userGlobalCoordinates, selectedDentalClinicMarker, google.maps.DirectionsService(), directionsRenderer) // try with 'new' if error
  })
}

function calcRoute(userGlobalCoordinates, dentistDestination, directionsService, directionsRenderer) {
  const selectedMode = document.getElementById('travel-mode-data').innerHTML
  const request = {
    origin: userGlobalCoordinates,
    destination: dentistDestination,
    travelMode: google.maps.TravelMode[selectedMode]
  }
  directionsService.route(request, function (response, status) {
    if (status === 'OK') {
      directionsRenderer.setDirections(response)
    }
  })
}

function createUserMarker(AdvancedMarkerElement) {
  const userIcon = document.createElement('img') // NOTE: Refactor in map-utils.js
  userIcon.src = 'https://i.ibb.co/cFB7cMR/User-Marker-Icon.png'

  // The marker that represents user's current global position
  const marker = new AdvancedMarkerElement({
    map: graphicalMap,
    position: userGlobalCoordinates,
    content: userIcon,
    title: 'Your Position'
  })
  console.log(marker)
}

function getZoomLevel() {
  return graphicalMap === -1 ? defaultZoomLevel : graphicalMap.zoom
}

function initiateMap(Map, AdvancedMarkerElement) {
  graphicalMap = new Map(document.getElementById('map'), {
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
  directionsRenderer.setMap(graphicalMap)
}

function updateRadius() {
  selectedRadius = document.getElementById('radius-data').innerHTML
  if (!selectedRadius) {
    selectedRadius = 10000
  }

  service = new google.maps.places.PlacesService(graphicalMap)
  service.nearbySearch(getNearbyRequest(), callback)
}

// Specify conditions for query of markers
function getNearbyRequest() {
  return {
    location: userGlobalCoordinates,
    radius: selectedRadius,
    type: ['dentist']
  }
}

initMap()
export { initMap, graphicalMap, calcRoute, userGlobalCoordinates, selectedDentalClinicMarker, directionsService, directionsRenderer, updateRadius, drawMap }
