/* eslint-disable no-return-assign */
/* eslint-disable promise/param-names */
/* eslint-disable no-async-promise-executor */
/* eslint-disable no-unexpected-multiline */
/* eslint-disable func-call-spacing */

// This script is the generalization of 'map.js' and 'search-map.js' and is executed at initialization of both scripts
/* eslint-disable no-undef */

import { listenForMarkerClickNearbyMode, nearbyMap, userGlobalCoordinates } from './map-modes/nearby-map'
import { listenForMarkerClickSearchMode, searchMap, drawSearchMap, referenceMarkerCoordinates } from './map-modes/search-map'

let currentMapMode = 'NEARBY'
let currentRadius = 10000
let nearbyClinicsQueryData

/*
  Define pages to integrate MapComponent with.
  Note that the strings below starts with 'localhost:8080'.
  Adding a new element 'my/test/page/' would integrate the map
  functionality at 'localhost:8080/my/test/page/', assuming that you
  also add MapComponent.vue in its template
*/
const integratedVueRoutes = ['map']

/*
Each map-mode script is solely executed when their respective mode is activated by the user.
This check is important since the exporting and importing between the map-scripts invokes them in unwanted conditions.
*/
function confirmExecutionConditions(mapMode) {
  const pathArray = window.location.href.split('/')
  const lastSubDomainPath = pathArray[pathArray.length - 1]

  const isAllowedPage = integratedVueRoutes.includes(lastSubDomainPath)

  return (isAllowedPage === true && currentMapMode === mapMode)
}

function integrateAPIKey() {
  (g => { let h; let a; let k; const p = 'The Google Maps JavaScript API'; const c = 'google'; const l = 'importLibrary'; const q = '__ib__'; const m = document; let b = window; b = b[c] || (b[c] = {}); const d = b.maps || (b.maps = {}); const r = new Set(); const e = new URLSearchParams(); const u = () => h || (h = new Promise(async (f, n) => { await (a = m.createElement('script')); e.set('libraries', [...r] + ''); for (k in g)e.set(k.replace(/[A-Z]/g, t => '_' + t[0].toLowerCase()), g[k]); e.set('callback', c + '.maps.' + q); a.src = `https://maps.${c}apis.com/maps/api/js?` + e; d[q] = f; a.onerror = () => h = n(Error(p + ' could not load.')); a.nonce = m.querySelector('script[nonce]')?.nonce || ''; m.head.append(a) })); d[l] ? console.warn(p + ' only loads once. Ignoring:', g) : d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n)) })
  ({ key: 'AIzaSyBezKgTO8Fu1ymaIoAoToNn0g5ZMjgSR4Y', v: 'weekly' })
}

function changeMapMode(newMapMode) {
  currentMapMode = newMapMode
}

function changeRadius(newRadius) {
  currentRadius = newRadius
}

function callbackUtils(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (let i = 0; i < results.length; i++) {
      createMarker(results[i])
    }
  }
}

function createMarker(place) {
  const marker = initializeMarker(place)

  if (currentMapMode === 'NEARBY') {
    listenForMarkerClickNearbyMode(marker, place)
  } else {
    listenForMarkerClickSearchMode(marker, place)
  }
}

function initializeMarker(place) {
  if (currentMapMode === 'NEARBY') {
    return new google.maps.Marker({
      map: nearbyMap,
      position: place.geometry.location
    })
  } else {
    return new google.maps.Marker({
      map: searchMap,
      position: place.geometry.location
    })
  }
}

// Display the related information about the clicked dental clinic marker in a window positioned at the selected dental clinic marker
function generateInfoWindowUtils(place, marker) {
  const ratingString = place.rating ? 'Rating: ' + place.rating + ` by ${place.user_ratings_total} users` : ''
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
  selectedDentistInfowindow.open(searchMap, marker)
}

// Update radius to query dental clinics in relative to a fixed position (user's pos or search-reference pos)
function updateRadius(service, map, centralMarkerCoordinates, currentRadius) {
  if (currentMapMode === 'SEARCH') {
    drawSearchMap()
  }

  performNearbyQuery(service, map, centralMarkerCoordinates, currentRadius)
}

function getReferencePosition() {
  const stringifiedCoordinates = (currentMapMode === 'NEARBY') ? userGlobalCoordinates : referenceMarkerCoordinates
  return stringifiedCoordinates.lat + ',' + stringifiedCoordinates.lng
}

function performNearbyQuery(service, map, centralMarkerCoordinates, selectedRadius) {
  console.warn(nearbyClinicsQueryData)

  service = new google.maps.places.PlacesService(map)
  service.nearbySearch(getNearbyRequest(centralMarkerCoordinates, selectedRadius), callbackUtils)

  // TODO:
  // 1) Replace the 2 lines above
  // 2) Export 'data' from MapComponent.vue and print it here
  // 3) Create markers on the map with 'data' variable

  // createMarker(place) <--- Use this
}

function setNearbyClinicsQueryData(value) {
  nearbyClinicsQueryData = value
}

// Specify conditions for query of markers
function getNearbyRequest(centralMarkerCoordinates, selectedRadius) {
  return {
    location: centralMarkerCoordinates,
    radius: selectedRadius,
    type: ['dentist']
  }
}

integrateAPIKey()

export {
  confirmExecutionConditions, changeMapMode, currentMapMode, changeRadius, currentRadius,
  callbackUtils, generateInfoWindowUtils, performNearbyQuery, updateRadius, initializeMarker, getReferencePosition, setNearbyClinicsQueryData
}
