/* eslint-disable no-undef */
/* eslint-disable no-return-assign */
/* eslint-disable promise/param-names */
/* eslint-disable no-async-promise-executor */
/* eslint-disable no-unexpected-multiline */
/* eslint-disable func-call-spacing */

import { getMeasurementInHalfQuantities, cutStringByMaxLengthAndDelimiter } from '../../src/utils'

const infoWindowMaxCharacters = 30
let selectedDentistInfowindow
let photoChunk
let addressChunk
let ratingsChunk
let employeesChunk

function generateWindow(clinic, map, marker) {
  if (selectedDentistInfowindow) { // If any infowindow is currently open, then close it before the newly clicked clinic's infowindow pops up
    selectedDentistInfowindow.close()
  }

  assignHtmlVariables(clinic)

  const contentString =
  `<strong class="header"><i class="fa-solid fa-tooth"></i> ${clinic.clinic_name}</strong>
  ${photoChunk}
  <p>
    ${addressChunk}
    ${ratingsChunk}
    ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ

    ${employeesChunk}
  </p>
  <style>
  .header {
    font-weight: 1000
  }
  </style>`

  selectedDentistInfowindow = new google.maps.InfoWindow({
    content: contentString
  })

  selectedDentistInfowindow.open(map, marker)
}

function assignHtmlVariables(clinic) {
  photoChunk = getPhotoHtml(clinic)
  addressChunk = getAddressHtml(clinic)
  ratingsChunk = getRatingsHtml(clinic)
  employeesChunk = getEmployeesHtml(clinic)
}

/*
    Accounts for the case where a photo cannot be retrieved (e.g if the clinic is fictitous and not a real clinic
    with preexisting data that Google API can fetch)
*/
function getPhotoHtml(clinic) {
  return clinic.photoURL
    ? `<div class="clinic-photo">
    <div style="float:right; width:20%;"><img src=${clinic.photoURL} width="120" height="80"/></div>
    <div style="float:right; width:80%;margin-top: -19px;">
  </div>`
    : ''
}

function getAddressHtml(clinic) {
  return clinic.address
    ? `<div class="clinic-address">
    <i class="fa-solid fa-location-dot"></i> Adress: ${cutStringByMaxLengthAndDelimiter(clinic.address, infoWindowMaxCharacters, ',')}
    </div>`
    : ''
}

function getRatingsHtml(clinic) {
  if (clinic.ratings) {
    const halfStarIcon = '<i class="fa-solid fa-star-half"></i>'
    const fullStarIcon = '<i class="fa-solid fa-star"></i>'
    const stars = getMeasurementInHalfQuantities(clinic.ratings, fullStarIcon, halfStarIcon)

    return `<div id="rating-string">
    <i class="fa-solid fa-circle-check"></i> Rating:
    </div>
    <div class="stars">
        ${stars}
    </div>`
  }

  return ''
}

function getEmployeesHtml(clinic) {
  return `<div class="clinic-employees">
  <i class="fa-solid fa-users"></i> Employees: ${getClinicEmployees(clinic)}
  </div>`
}

// Returns the employee names in seperate rows in HTML format
function getClinicEmployees(clinic) {
  let clinicEmployees = '<br>'
  clinic.employees.forEach((element) => clinicEmployees += element.dentist_name + '<br>')
  return clinicEmployees
}

export { generateWindow }
