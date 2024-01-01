/* eslint-disable no-return-assign */
/* eslint-disable promise/param-names */
/* eslint-disable no-async-promise-executor */
/* eslint-disable no-unexpected-multiline */
/* eslint-disable func-call-spacing */

// This script is the generalization of 'map.js' and 'search-map.js' and is executed at initialization of both scripts
/* eslint-disable no-undef */

import { listenForMarkerClickNearbyMode, nearbyMap, userGlobalCoordinates, drawNearbyMap } from './map-modes/nearby-map'
import { listenForMarkerClickSearchMode, searchMap, drawSearchMap, markerCoordinates } from './map-modes/search-map'
import { Api } from '../../src/Api.js'

let currentMapMode = 'Nearby'

// Two types of clinic quries:
let currentRadius = 10 // radius query
let currentQueryNumber // fixed number query

let nearbyClinicsQueryData // TODO: Rename to 'clinicsToDisplayData'
let selectedQueryMode = 'radius' // Possible values: 'radius' and 'number'
let selectedDentistInfowindow
const clinicStatisticsMap = new Map()
const defaultZoomLevel = 12

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

// Restore most recent zoom level every time the map is loaded
function getZoomLevel() {
  const map = currentMapMode === 'Nearby' ? nearbyMap : searchMap
  return map === -1 ? defaultZoomLevel : map.zoom
}

function createMarker(referenceCoordinates, clinic) {
  const marker = initializeMarker(referenceCoordinates)

  if (currentMapMode === 'Nearby') {
    listenForMarkerClickNearbyMode(marker, clinic)
  } else {
    listenForMarkerClickSearchMode(marker, clinic)
  }
}

function initializeMarker(referenceCoordinates) {
  if (currentMapMode === 'Nearby') {
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
  const clinicRatings = clinic.ratings ? clinic.ratings : '-1'
  clinicStatisticsMap.set('ratings', clinicRatings)

  // If any infowindow is currently open, then close it before the newly clicked clinic's infowindow pops up
  if (selectedDentistInfowindow) {
    selectedDentistInfowindow.close()
  }

  // selectedDentistInfowindow = new google.maps.InfoWindow() // PREVIOUS: WORKS

  // ----------------- CALCULATE ATTRIBUTES (Refactor later) -------------------

  let clinicEmployees = ''
  clinic.employees.forEach((element) => clinicEmployees += element.dentist_name + '<br>')

  let displayedStarsString = ''

  for (let i = parseFloat(clinic.ratings); i > 0; i--) {
    if (i < 1 && i > 0.4) { // Add half star
      displayedStarsString += '<i class="fa-solid fa-star-half"></i>'
    } else if (i >= 1) { // Add full star
      displayedStarsString += '<i class="fa-solid fa-star"></i>'
    }
  }

  // ---------------------------------------------------------------------------

  const contentString = `<strong class="header"><i class="fa-solid fa-tooth"></i> ${clinic.clinic_name}</strong>

  <div class="clinic-photo">
  <div style="float:right; width:20%;"><img src=${clinic.photoURL} width="120" height="80"/></div>
  <div style="float:right; width:80%;margin-top: -19px;">
  </div>

  <p>
    <div class="clinic-address">
      <i class="fa-solid fa-location-dot"></i> Adress: ${clinic.address}
    </div>

    <div id="rating-string">
      <i class="fa-solid fa-circle-check"></i> Rating:
    </div>

    <div class="stars">
      ${displayedStarsString}
    </div>
    ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ

    <div class="clinic-employees">
      <i class="fa-solid fa-users"></i> Employees: ${clinicEmployees}
    </div>
  </p>
  <style>
  .header {
    font-weight: 1000
  }
  </style>`

  // selectedDentistInfowindow.setContent(contentString)

  selectedDentistInfowindow = new google.maps.InfoWindow({
    content: contentString,
    maxWidth: false,
    ariaLabel: 'My title'
  })

  // ----------------------  RATINGS TRY -----------------------------
  /*
  $(this.getcontent()).find('.stars').raty({
    half: true,
    score: function () {
      return $(this).attr('data-score')
    },
    readonly: true,
    path: 'https://raw.githubusercontent.com/wbotelhos/raty/master/demo/images/'
  })
  */

  // Vanilla JS Version (V4+)
  /*
  const myRaty = new Raty(document.querySelector('.demo'), { // 'Raty' is not defined, try importing it?
    // options
    // shows a cancel button to cancel the rating.
    cancelButton: false,
    // CSS class for cancel button
    cancelClass: 'raty-cancel',
    // hint of cancel button
    cancelHint: 'Cancel this rating!',
    // icons for cancel button
    cancelOff: 'cancel-off.png',
    cancelOn: 'cancel-on.png',
    // position of cancel button
    cancelPlace: 'left',
    // fired on rating click
    click: function (score, element, evt) {
      const objectInstance = this
      console.log(objectInstance)
    },
    // enable half star selection
    half: false,
    // enable half star
    halfShow: true,
    // default hints of stars
    hints: ['bad', 'poor', 'regular', 'good', 'gorgeous'],
    // Object list with position and icon on and off to do a mixed icons.
    iconRange: undefined,
    iconRangeSame: false,
    // fired on mouseout.
    mouseout: function (score, element, evt) {
      const objectInstance = this
      console.log(objectInstance)
    },
    // fired on mouseover
    mouseover: function (score, element, evt) {
      const objectInstance = this
      console.log(objectInstance)
    },
    // hint for no rated elements when it's readOnly.
    noRatedMsg: 'Not rated yet!',
    // number of stars
    number: 5,
    // max number of stars
    numberMax: 5,
    // a global locate where the icon will be looked.
    path: undefined,
    // enables the selection of a precision score.
    precision: false,
    // enables readonly mode
    readOnly: false, // NOTE: Set to 'true' later -----------------------------
    // included values attributes to do the score round math.
    round: { down: 0.25, full: 0.6, up: 0.76 },
    // initial rating
    score: undefined,
    // name of the hidden field that holds the score value.
    scoreName: 'score',
    // enables just a single star selection.
    single: false,
    // space between icons
    space: true
  })
  */

  // NOTE: IF THE ABOVE CODE DOESN'T WORK, Copy-paste options to the field below
  // jQuery Version (V3)
  /*
  $('.demo').raty({
    // options
    // shows a cancel button to cancel the rating.
    cancelButton: false,
    // CSS class for cancel button
    cancelClass: 'raty-cancel',
    // hint of cancel button
    cancelHint: 'Cancel this rating!',
    // icons for cancel button
    cancelOff: 'cancel-off.png',
    cancelOn: 'cancel-on.png',
    // position of cancel button
    cancelPlace: 'left',
    // fired on rating click
    click: function (score, element, evt) {
      const objectInstance = this
      console.log(objectInstance)
    },
    // enable half star selection
    half: false,
    // enable half star
    halfShow: true,
    // default hints of stars
    hints: ['bad', 'poor', 'regular', 'good', 'gorgeous'],
    // Object list with position and icon on and off to do a mixed icons.
    iconRange: undefined,
    iconRangeSame: false,
    // fired on mouseout.
    mouseout: function (score, element, evt) {
      const objectInstance = this
      console.log(objectInstance)
    },
    // fired on mouseover
    mouseover: function (score, element, evt) {
      const objectInstance = this
      console.log(objectInstance)
    },
    // hint for no rated elements when it's readOnly.
    noRatedMsg: 'Not rated yet!',
    // number of stars
    number: 5,
    // max number of stars
    numberMax: 5,
    // a global locate where the icon will be looked.
    path: undefined,
    // enables the selection of a precision score.
    precision: false,
    // enables readonly mode
    readOnly: false, // NOTE: Set to 'true' later -----------------------------
    // included values attributes to do the score round math.
    round: { down: 0.25, full: 0.6, up: 0.76 },
    // initial rating
    score: undefined,
    // name of the hidden field that holds the score value.
    scoreName: 'score',
    // enables just a single star selection.
    single: false,
    // space between icons
    space: true
  })

  $('.demo').raty('score', 4)
  console.log($('.demo').raty('score'))

  console.log(myRaty)
  */
  // ------------------------------------------------------------------

  selectedDentistInfowindow.open(map, marker)
}

// Update radius to query dental clinics in relative to a fixed position (user's pos or search-reference pos)
function updateRadius() {
  if (currentMapMode === 'Search') {
    drawSearchMap()
  }

  drawClinicMarkers()
}

function getReferencePosition() {
  // const stringifiedCoordinates = (currentMapMode === 'Nearby') ? userGlobalCoordinates : referenceMarkerCoordinates
  const stringifiedCoordinates = (currentMapMode === 'Nearby') ? userGlobalCoordinates : markerCoordinates
  return stringifiedCoordinates.lat + ',' + stringifiedCoordinates.lng
}

// Create visual markers of every clinic that was sent in the payload from Clinic Service
function drawClinicMarkers() {
  console.warn(nearbyClinicsQueryData.clinics)
  // eslint-disable-next-line no-eval
  const clinicsDataResponse = eval(nearbyClinicsQueryData.clinics)

  if (clinicsDataResponse) {
    for (let i = 0; i < clinicsDataResponse.length; i++) {
      const currentClinic = clinicsDataResponse[i]

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
function setFixedQueryNumber(value) {
  currentQueryNumber = value
}

/*
 Note for developers: The data{} variables in MapComponent.vue cannot be read before the scripts
 initiates the map at the start of the application. Therefore, we use the function below to read
 the variables that constitute the query-settings to be performed in Clinic Service in this script,
 which is the 'main' script (the origin of the codeflow across all existing map-related scripts in
  this Patient Client component)
*/
function manageNearbyQueryRequest() { // Accounts for both types of queries (radius and N-closest clinics) and looks at user's input to decide what methods to execute
  const queryValue = (selectedQueryMode === 'radius') ? currentRadius : currentQueryNumber
  // MapComponent.methods.sendNearbyQueryRequest(selectedQueryMode, queryValue)
  sendNearbyQueryRequest(selectedQueryMode, queryValue)
}

/*
  Note for developers:
  queryMode = 'radius' OR 'number'
  queryValue = { value with corresponding unit of measure of the specified queryMode ('radius' --> kilometers, 'number' --> N closest clinics) }
*/
async function sendNearbyQueryRequest(queryMode, queryValue) { // Sends the query-request to Patient API
  const queryUrl = `/clinics/${queryMode}/positions?${queryMode}=${queryValue}&coordinates=${getReferencePosition()}`
  const { data } = await Api.get(queryUrl)

  setNearbyClinicsQueryData(data)
  updateMapUI()
}

function updateMapUI() {
  if (currentMapMode === 'Nearby') {
    drawNearbyMap()
  } else {
    updateRadius()
  }
}

integrateAPIKey()

export {
  confirmExecutionConditions, changeMapMode, currentMapMode, changeRadius, currentRadius, getZoomLevel,
  generateInfoWindowUtils, drawClinicMarkers, updateRadius, getReferencePosition, setNearbyClinicsQueryData,
  selectedQueryMode, setSelectedQueryMode, manageNearbyQueryRequest, currentQueryNumber, setFixedQueryNumber,
  defaultZoomLevel, clinicStatisticsMap, sendNearbyQueryRequest
}
