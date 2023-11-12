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
    // userGlobalCoordinates = { lat: latitude, lng: longitude }
    assignUserCoordinates({ lat: latitude, lng: longitude })
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

  // --------------------------------------------------
  // NOTE: Add elements in 'html.index' later
  // NOTE: After 'html.index' content is done, transfer it to Map.vue
  if (!nearbyModeActivated()) {
    const card = document.getElementById('pac-card')
    const input = document.getElementById('pac-input')
    const biasInputElement = document.getElementById('use-location-bias')
    const strictBoundsInputElement = document.getElementById('use-strict-bounds')
    const options = {
      fields: ['formatted_address', 'geometry', 'name'],
      strictBounds: false
    }

    map.controls[google.maps.ControlPosition.TOP_LEFT].push(card)
    const autocomplete = new google.maps.places.Autocomplete(input, options)
    autocomplete.bindTo('bounds', graphicalMap)

    const infowindow2 = new google.maps.InfoWindow()
    const infowindow2Content = document.getElementById('infowindow-content')
    infowindow2.setContent(infowindow2Content)
  }
  // --------------------------------------------------

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

  let marker

  if (nearbyModeActivated()) {
    // The marker that represents user's current global position
    marker = new AdvancedMarkerElement({
      map: graphicalMap,
      position: userGlobalCoordinates,
      content: userIcon,
      title: 'Your Position'
    })
  } else {
    marker = new google.maps.Marker({
      map: graphicalMap,
      anchorPoint: new google.maps.Point(0, -29)
    })
  }

  console.log(marker)

  if (!nearbyModeActivated()) { // NOTE add this check for the things above
    autocomplete.addListener('place_changed', () => {
      infowindow2.close()
      marker.setVisible(false)
    })

    const place = autocomplete.getPlace()
    if (!place.geometry || place.geometry.location) {
      window.alert("No details available for input: '" + place.name + "'")
      return
    }

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      graphicalMap.fitBounds(place.geometry.viewport)
    } else {
      graphicalMap.setCenter(place.geometry.location)
      graphicalMap.setZoom(17)
    }

    marker.setPosition(place.geometry.location)
    marker.setVisible(true)
    infowindow2Content.children['place-name'].textContent = place.name
    infowindow2Content.children['place-address'].textContent = place.formatted_address
    infowindow.open(graphicalMap, marker)
  }
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

function assignUserCoordinates(currentGlobalCoordinates) {
  // Display user's current position on map
  if (nearbyModeActivated()) {
    userGlobalCoordinates = currentGlobalCoordinates
    console.warn('assign coords')
  } else { // User sets a fictional position on map to discover or search for clinics worldwide
    console.warn('In development...')
  }
}

function nearbyModeActivated() {
  return document.getElementById('mode-data').innerHTML === 'NEARBY'
}

function setupClickListener(id, types) {
  const radioButton = document.getElementById(id)

  radioButton.addEventListener('click', () => {
    autocomplete.setTypes(types)
    input.value = ''
  })
}

if (!nearbyModeActivated()) { // NOTE: Double check curly brackets
  setupClickListener('changetype-all', [])
  setupClickListener('changetype-address', ['address'])
  setupClickListener('changetype-establishment', ['establishment'])
  setupClickListener('changetype-geocode', ['geocode'])
  setupClickListener('changetype-cities', ['(cities)'])
  setupClickListener('changetype-regions', ['(regions)'])

  biasInputElement.addEventListener('change', () => {
    if (biasInputElement.checked) {
      autocomplete.bindTo('bounds', graphicalMap)
    } else {
      // User wants to turn off location bias, so three things need to happen:
      // 1. Unbind from map
      // 2. Reset the bounds to whole world
      // 3. Uncheck the strict bounds checkbox UI (which also disables strict bounds)
      autocomplete.unbind('bounds')
      autocomplete.setBounds({ east: 180, west: -180, north: 90, south: -90 })
      strictBoundsInputElement.checked = biasInputElement.checked
    }

    input.value = ''
  })

  strictBoundsInputElement.addEventListener('change', () => {
    autocomplete.setOptions({
      strictBounds: strictBoundsInputElement.checked
    })
    if (strictBoundsInputElement.checked) {
      biasInputElement.checked = strictBoundsInputElement.checked
      autocomplete.bindTo('bounds', graphicalMap)
    }

    input.value = ''
  })
}

initMap()
export { initMap, graphicalMap, calcRoute, userGlobalCoordinates, selectedDentalClinicMarker, directionsService, directionsRenderer }
