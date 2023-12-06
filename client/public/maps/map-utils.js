/* eslint-disable no-return-assign */
/* eslint-disable promise/param-names */
/* eslint-disable no-async-promise-executor */
/* eslint-disable no-unexpected-multiline */
/* eslint-disable func-call-spacing */

// This script is the generalization of 'map.js' and 'search-map.js' and is executed at initialization of both scripts
/* eslint-disable no-undef */

import { listenForMarkerClickNearbyMode, nearbyMap, userGlobalCoordinates } from './map-modes/nearby-map'
import { listenForMarkerClickSearchMode, searchMap, drawSearchMap, referenceMarkerCoordinates } from './map-modes/search-map'

import MapComponent from '../../src/components/MapComponent.vue'

let currentMapMode = 'NEARBY'

// Two types of clinic quries:
let currentRadius = 10000 // radius query
let currentQueryNumber // fixed number query

let nearbyClinicsQueryData // TODO: Rename to 'clinicsToDisplayData'
let selectedQueryMode = 'radius' // Possible values: 'radius' and 'number'

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

function createMarker(referenceCoordinates, clinic) {
  const marker = initializeMarker(referenceCoordinates)

  if (currentMapMode === 'NEARBY') {
    listenForMarkerClickNearbyMode(marker, clinic)
  } else {
    listenForMarkerClickSearchMode(marker, clinic)
  }
}

function initializeMarker(referenceCoordinates) {
  if (currentMapMode === 'NEARBY') {
    return new google.maps.Marker({
      map: nearbyMap,
      position: referenceCoordinates
    })
  } else {
    return new google.maps.Marker({
      map: searchMap,
      position: referenceCoordinates
    })
  }
}

// Display the related information about the clicked dental clinic marker in a window positioned at the selected dental clinic marker
function generateInfoWindowUtils(clinic, marker, map) {
  // const ratingString = place.rating ? 'Rating: ' + place.rating + ` by ${place.user_ratings_total} users` : ''
  const selectedDentistInfowindow = new google.maps.InfoWindow()

  /*
  PREVIOUS:
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
  */

  selectedDentistInfowindow.setContent(
    `<strong class="header">${clinic.clinic_name}</strong>
    <p>
    Adress: Adress here <br>
    Rating here <br>
    Employees: <br>
    ${clinic.employees}
    </p>
    <style>
    .header {
      font-weight: 1000
    }
    </style>`
  )
  selectedDentistInfowindow.open(map, marker)
}

// Update radius to query dental clinics in relative to a fixed position (user's pos or search-reference pos)
function updateRadius() {
  if (currentMapMode === 'SEARCH') {
    drawSearchMap()
  }

  drawClinicMarkers()
}

function getReferencePosition() {
  const stringifiedCoordinates = (currentMapMode === 'NEARBY') ? userGlobalCoordinates : referenceMarkerCoordinates
  return stringifiedCoordinates.lat + ',' + stringifiedCoordinates.lng
}

function drawClinicMarkers() {
  console.warn(nearbyClinicsQueryData)

  if (nearbyClinicsQueryData) {
    for (let i = 0; i < nearbyClinicsQueryData.length; i++) {
      const currentClinic = nearbyClinicsQueryData[i]

      const positionArray = currentClinic.position.split(',')
      const referenceCoordinates = { lat: parseFloat(positionArray[0]), lng: parseFloat(positionArray[1]) }
      createMarker(referenceCoordinates, currentClinic)
    }
  }
}

// Store the data (clinics to display on map) retrieved in MapComponent.vue from Clinic Service
function setNearbyClinicsQueryData(value) {
  nearbyClinicsQueryData = value
}

// Potential values: 'radius' or 'number'
function setSelectedQueryMode(value) {
  selectedQueryMode = value
}

// Set the numerical value for the N-closest clinics
function setQueryNumber(value) {
  currentQueryNumber = value
}

// ----------   REFACTOR FROM MapComponent.vue   --------------

/*
 Note for developers: The data{} variables in MapComponent.vue cannot be read before the scripts
 initiates the map at the start of the application. Therefore, we use the function below to read
 the variables that constitute the query-settings to be performed in Clinic Service in this script,
 which is the 'main' script (the origin of the codeflow across all existing map-related scripts in
  this Patient Client component)
*/

// IDEA: The function below sends general information to nearby-map.js
function performGeneralQuery() { // General: Accounts for both types of queries and looks at user's input to decide what methods to execute
  console.warn('perform general query - in map-utils.js')
  const queryValue = (selectedQueryMode === 'radius') ? currentRadius : currentQueryNumber
  MapComponent.methods.performClinicQueryTest(selectedQueryMode, queryValue)
}

// -------------------------------------------------------

integrateAPIKey()

export {
  confirmExecutionConditions, changeMapMode, currentMapMode, changeRadius, currentRadius,
  generateInfoWindowUtils, drawClinicMarkers, updateRadius, getReferencePosition, setNearbyClinicsQueryData,
  selectedQueryMode, setSelectedQueryMode, performGeneralQuery, currentQueryNumber, setQueryNumber
}
