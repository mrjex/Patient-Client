import { userGlobalCoordinates } from './map'

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
  const pathArray = window.location.href.split('/')
  const lastSubDomainPath = pathArray[pathArray.length - 1]

  // TODO: Export 'userGlobalCoordinates' from map.js or intermediaryExecutor.js and out it in 'center' attribute below
  if (lastSubDomainPath === 'map' && document.getElementById('mode-data').innerHTML === 'SEARCH') { // NOTE: Refactor this 'subDomainPath' check later
    console.warn('in search-map.js')
    console.warn(markerCoordinates)
    map = new google.maps.Map(document.getElementById('map'), {
      center: markerCoordinates,
      zoom: 13,
      mapTypeControl: false
    })

    const card = document.getElementById('pac-card')
    const input = document.getElementById('pac-input')
    const biasInputElement = document.getElementById('use-location-bias')
    const strictBoundsInputElement = document.getElementById('use-strict-bounds')
    const options = {
      fields: ['formatted_address', 'geometry', 'name'],
      strictBounds: false
    }

    const autocomplete = new google.maps.places.Autocomplete(input, options)
    autocomplete.bindTo('bounds', map)

    infowindowSearchReference = new google.maps.InfoWindow() // The info-window for the marker positioned according to the input of the search-prompt
    infowindowContentSearchReference = document.getElementById('infowindow-content')

    infowindowSearchReference.setContent(infowindowContentSearchReference)

    userMarker = new google.maps.Marker({
      map,
      anchorPoint: new google.maps.Point(0, -29)
    })

    // When user enters a search command in the search-prompt
    autocomplete.addListener('place_changed', () => {
      infowindowSearchReference.close()
      userMarker.setVisible(false)

      searchedPlace = autocomplete.getPlace()
      markerCoordinates = searchedPlace.geometry.location

      directionsServiceSearch = new google.maps.DirectionsService() //
      directionsRendererSearch = new google.maps.DirectionsRenderer() //
      directionsRendererSearch.setMap(map) //

      if (!searchedPlace.geometry || !searchedPlace.geometry.location) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
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
      userMarker.setVisible(true)

      infowindowContentSearchReference.children['place-name'].textContent = searchedPlace.name
      infowindowContentSearchReference.children['place-address'].textContent =
          searchedPlace.formatted_address
      infowindowSearchReference.open(map, userMarker)
    })

    updateRadiusSearch() //

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

function callback(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (let i = 0; i < results.length; i++) {
      createMarker(results[i])
    }
  }
}

function createMarker(place) {
  const marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  })

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

    calcRouteSearch(searchedPlace.geometry.location, selectedDentalClinicMarkerSearch, directionsServiceSearch, directionsRendererSearch)
  })
}

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

function updateRadiusSearch() {
  selectedRadius = document.getElementById('radius-data').innerHTML //
  if (!selectedRadius) { //
    selectedRadius = 10000 //
  }

  const request = {
    location: markerCoordinates, // searchedPlace.geometry.location
    radius: selectedRadius,
    type: ['dentist']
  }
  service = new google.maps.places.PlacesService(map) //
  service.nearbySearch(request, callback)
}

window.initMap = initSearchMap
export {
  initSearchMap, calcRouteSearch, searchedPlace, selectedDentalClinicMarkerSearch, directionsServiceSearch, directionsRendererSearch,
  updateRadiusSearch, selectedRadius, infowindowContentSearchReference, infowindowSearchReference, markerCoordinates
}
