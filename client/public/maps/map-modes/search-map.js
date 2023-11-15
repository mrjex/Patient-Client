// import { confirmExecutionConditions } from '../map-utils'

/* eslint-disable no-undef */
let service //
let directionsServiceSearch //
let directionsRendererSearch //

let selectedDentalClinicMarkerSearch //

let userMarker

let selectedRadius
let infowindowSearchReference
let infowindowContentSearchReference
let markerCoordinates = { lat: 40.749933, lng: -73.98633 }

let map
let searchedPlace

function initSearchMap() {
  // launchMapUtils(markerCoordinates)
  const pathArray = window.location.href.split('/')
  const lastSubDomainPath = pathArray[pathArray.length - 1]
  if (lastSubDomainPath === 'map' && document.getElementById('mode-data').innerHTML === 'SEARCH') { // confirmExecutionConditions('SEARCH')
    console.warn('in search-map.js')

    initiateMap()

    // const card = document.getElementById('pac-card')
    const input = document.getElementById('pac-input')
    const biasInputElement = document.getElementById('use-location-bias')
    const strictBoundsInputElement = document.getElementById('use-strict-bounds')

    infowindowSearchReference = new google.maps.InfoWindow() // The info-window for the marker positioned according to the input of the search-prompt
    infowindowContentSearchReference = document.getElementById('infowindow-content')
    infowindowSearchReference.setContent(infowindowContentSearchReference)

    updateRadiusSearch()
    onSearchLocation(input)

    // Sets a listener on a radio button to change the filter type on Places
    // Autocomplete.
    function setupClickListener(id, types) {
      const radioButton = document.getElementById(id)

      if (radioButton) {
        radioButton.addEventListener('click', () => {
          autocomplete.setTypes(types)
          input.value = ''
        })
      }
    }

    setupClickListener('changetype-all', [])
    setupClickListener('changetype-address', ['address'])
    setupClickListener('changetype-establishment', ['establishment'])
    setupClickListener('changetype-geocode', ['geocode'])
    setupClickListener('changetype-cities', ['(cities)'])
    setupClickListener('changetype-regions', ['(regions)'])

    if (biasInputElement) {
      biasInputElement.addEventListener('change', () => {
        if (biasInputElement.checked) {
          autocomplete.bindTo('bounds', map)
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
    }

    // NOTE: All of the Search-UI variables are null on the second instance the 'SEARCH' mode is called
    if (strictBoundsInputElement) {
      strictBoundsInputElement.addEventListener('change', () => {
        autocomplete.setOptions({
          strictBounds: strictBoundsInputElement.checked
        })
        if (strictBoundsInputElement.checked) {
          biasInputElement.checked = strictBoundsInputElement.checked
          autocomplete.bindTo('bounds', map)
        }
        input.value = ''
      })
    }
  }
}

// When user enters a search command in the search-prompt
function onSearchLocation(input) {
  const options = {
    fields: ['formatted_address', 'geometry', 'name'],
    strictBounds: false
  }

  const autocomplete = new google.maps.places.Autocomplete(input, options)
  autocomplete.bindTo('bounds', map)

  autocomplete.addListener('place_changed', () => {
    infowindowSearchReference.close()

    searchedPlace = autocomplete.getPlace()
    markerCoordinates = searchedPlace.geometry.location
    directionsRendererSearch.setMap(map) //

    if (!searchedPlace.geometry || !searchedPlace.geometry.location) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed
      window.alert("No details available for input: '" + searchedPlace.name + "'")
      // return
    }

    // If the place has a geometry, then present it on a map.
    if (searchedPlace.geometry.viewport) {
      map.fitBounds(searchedPlace.geometry.viewport)
    } else {
      map.setCenter(searchedPlace.geometry.location)
      map.setZoom(17)
    }

    userMarker.setPosition(searchedPlace.geometry.location)
    updateRadiusSearch()

    if (!infowindowContentSearchReference) {
      console.warn('infowindowContet is null')
    }
    infowindowContentSearchReference.children['place-name'].textContent = searchedPlace.name
    infowindowContentSearchReference.children['place-address'].textContent =
            searchedPlace.formatted_address
    infowindowSearchReference.open(map, userMarker)
  })
}

function callback(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (let i = 0; i < results.length; i++) {
      createMarker(results, i)
    }
  }
}

function createMarker(results, i) {
  const place = results[i]
  const marker = new google.maps.Marker({
    map,
    position: place.geometry.location
  })

  // A small window disclosing address and ratings about the dental clinic pops up its associated marker is clicked
  google.maps.event.addListener(marker, 'click', function () {
    selectedDentalClinicMarkerSearch = marker.position

    const ratingString = place.rating ? 'Rating: ' + place.rating + ` by ${place.user_ratings_total} users` : ''
    // console.warn(place.photos[0].getUrl()) // NOTE: Some dentists have pics and some not

    const selectedDentistInfowindow = new google.maps.InfoWindow()

    selectedDentistInfowindow.setContent(
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
    selectedDentistInfowindow.open(map, marker)

    // calcRouteSearch(searchedPlace.geometry.location, selectedDentalClinicMarkerSearch, directionsServiceSearch, directionsRendererSearch)
  })
}

// NOTE: Ask group whether or not they can paths to be displayed in this mode as well. ATM its method call is commented
function calcRouteSearch(searchPlaceCoordinates, dentistDestination, directionsService, directionsRenderer) {
  console.warn('search-map.js calc')
  const selectedMode = document.getElementById('travel-mode-data').innerHTML
  const request = {
    origin: searchPlaceCoordinates,
    destination: dentistDestination,
    travelMode: google.maps.TravelMode[selectedMode]
  }
  directionsService.route(request, function (response, status) {
    if (status === 'OK') {
      directionsRenderer.setDirections(response)
    }
  })
}

function updateRadiusSearch() { // NOTE: Refactor into map-utils.js later
  // NOTE: Refactor into 'selectRadius()' function
  selectedRadius = document.getElementById('radius-data').innerHTML //
  if (!selectedRadius) { //
    selectedRadius = 10000 //
  }

  initiateMap()

  // NOTE: Refactor into a self-contained 'nearbySearch' component
  service = new google.maps.places.PlacesService(map) //
  service.nearbySearch(getNearbyRequest(), callback)
}

function getNearbyRequest() {
  return {
    location: markerCoordinates,
    radius: selectedRadius,
    type: ['dentist']
  }
}

// Create the marker that represents the position in the search-prompt
function createReferenceMarker() {
  const svgMarker = { // NOTE: Use picture from map.js and convert it to svg path
    path: 'M-1.547 12l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM0 0q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z',
    fillColor: 'blue',
    fillOpacity: 1,
    strokeWeight: 0,
    rotation: 0,
    scale: 4,
    anchor: new google.maps.Point(0, 20)
  }

  userMarker = new google.maps.Marker({
    map,
    icon: svgMarker,
    position: markerCoordinates
  })
}

function initiateMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: markerCoordinates,
    zoom: 13,
    mapTypeControl: false
  })

  createReferenceMarker()
  initiateDirectionsComponents()
}

function initiateDirectionsComponents() {
  directionsServiceSearch = new google.maps.DirectionsService()
  directionsRendererSearch = new google.maps.DirectionsRenderer()
}

window.initMap = initSearchMap
export {
  initSearchMap, calcRouteSearch, searchedPlace, selectedDentalClinicMarkerSearch, directionsServiceSearch, directionsRendererSearch,
  markerCoordinates, updateRadiusSearch
}
