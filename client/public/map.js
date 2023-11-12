import { zoomLevel } from './intermediaryExecutor.js'

/* eslint-disable no-undef */
let graphicalMap
let service
let infowindow

let userGlobalCoordinates
let directionsService
let directionsRenderer
let selectedDentalClinicMarker

async function initMap() {
  // PREVIOUS: const watchId = navigator.geolocation.watchPosition(async position => {
  // POTENTIAL CHANGE: navigator.geolocation.getCurrentPosition(position => {)
  // NOTE: If 'blinking update' bug continues to grow as program is developed, switch to 'navigator.geolocation.getCurrentPosition()'
  navigator.geolocation.watchPosition(async position => { // NOTE: Fix this bug today: Try walking outside with phone using 'getCurrentPos' for real-time updating
    const { latitude, longitude } = position.coords
    userGlobalCoordinates = { lat: latitude, lng: longitude }
  })
  directionsService = new google.maps.DirectionsService()
  directionsRenderer = new google.maps.DirectionsRenderer()

  drawMap(userGlobalCoordinates)
}

async function drawMap(userGlobalCoordinates) {
  // @ts-ignore
  const { Map } = await google.maps.importLibrary('maps')
  const { AdvancedMarkerElement } = await google.maps.importLibrary('marker')

  graphicalMap = new Map(document.getElementById('map'), {
    zoom: zoomLevel,
    center: userGlobalCoordinates,
    mapId: 'DEMO_MAP_ID'
  })

  directionsRenderer.setMap(graphicalMap)
  let selectedRadius = document.getElementById('radius-data').innerHTML

  if (!selectedRadius) {
    selectedRadius = 10000 // Default value
  }

  const request = {
    location: userGlobalCoordinates,
    radius: selectedRadius,
    type: ['dentist']
  }

  infowindow = new google.maps.InfoWindow()
  service = new google.maps.places.PlacesService(graphicalMap)
  service.nearbySearch(request, callback)

  const userIcon = document.createElement('img')
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

  // NOTE: This checks when user clicks 'OK' on popup --> Research on how to check when
  google.maps.event.addListener(marker, 'click', function () {
    selectedDentalClinicMarker = marker.position

    const ratingString = place.rating ? 'Rating: ' + place.rating + ` by ${place.user_ratings_total} users` : ''
    // console.warn(place.user_ratings_total)

    // infowindow.setContent('Yo mr jex')
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

    /*
    // Photo feature: An alert with a button that takes the user to a different window that shows a picture of the clinic
    alert(place.name)
    window.open(place.photos[0].getUrl(), '_blank') // NOTE: It only works for a couple of photos (most likely because only PNG is supported) - Conduct further research on this issue later
    infowindow.open(map, this) // This line evokes an error
    */
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

initMap()
export { initMap, graphicalMap, calcRoute, userGlobalCoordinates, selectedDentalClinicMarker, directionsService, directionsRenderer }
