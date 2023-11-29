<template>
  <div class="ui grid map-vue">
    <div id="map"></div>
      <div class="field map-vue-radius-options">

        <strong>Query Radius:</strong>
        <select v-model="currentRadius" @click.prevent="changeSearchRange">
          <option value="250">0.25 KM</option>
          <option value="500">0.5 KM</option>
          <option value="1000">1 KM</option>
          <option value="3000">3 KM</option>
          <option value="5000">5 KM</option>
          <option value="10000">10 KM</option>
          <option value="15000">15 KM</option>
          <option value="20000">20 KM</option>
          <option value="30000">30 KM</option>
          <option value="50000">50 KM</option>
          <option value="100000">100 KM</option>
        </select>
      </div>

    <div v-if="selectedMode === 'NEARBY'">
      <strong>Travel Mode: </strong>
      <select v-model="currentTravelMode" id="mode" @click.prevent="changeTravelMode">
        <option value="DRIVING">Driving</option>
        <option value="WALKING">Walking</option>
        <option value="BICYCLING">Bicycling</option>
        <option value="TRANSIT">Transit</option>
      </select>
    </div>

    <div class="modes">
      <strong>Map Mode:</strong>
      <button type="button" class="btn btn-success" @click.prevent="nearbyMode">NEARBY</button>
      <button type="button" class="btn btn-success" @click.prevent="searchMode">SEARCH</button>
    </div>

    <div class="map-search-mode" v-if="selectedMode === 'SEARCH'">
      <div class="pac-card" id="pac-card">
        <div>
          <div id="title">Search for reference position</div>
          <div id="type-selector" class="pac-controls">
            <input
              type="radio"
              name="type"
              id="changetype-all"
              checked="checked"
            />
            <label for="changetype-all">All</label>
            <input type="radio" name="type" id="changetype-establishment" />
            <label for="changetype-establishment">establishment</label>

            <input type="radio" name="type" id="changetype-address" />
            <label for="changetype-address">address</label>

            <input type="radio" name="type" id="changetype-geocode" />
            <label for="changetype-geocode">geocode</label>

            <input type="radio" name="type" id="changetype-cities" />
            <label for="changetype-cities">(cities)</label>

            <input type="radio" name="type" id="changetype-regions" />
            <label for="changetype-regions">(regions)</label>
          </div>
          <br />
          <div id="strict-bounds-selector" class="pac-controls">
            <input type="checkbox" id="use-location-bias" value="" checked />
            <label for="use-location-bias">Bias to map viewport</label>

            <input type="checkbox" id="use-strict-bounds" value="" />
            <label for="use-strict-bounds">Strict bounds</label>
          </div>
        </div>
        <div id="pac-container">
          <input id="pac-input" type="text" placeholder="Enter a location" />
        </div>
      </div>
    <div id="infowindow-content">
      <span id="place-name" class="title"></span><br />
      <span id="place-address"></span>
    </div>
    </div>
  </div>
</template>

<script>

import { calcRoute, userGlobalCoordinates, selectedDentalClinicMarker, directionsService, directionsRenderer, drawNearbyMap, initMap, changeTravelMode, deselectClinicMarker } from '../../public/maps/map-modes/nearby-map.js'
import { initSearchMap, service, searchMap, markerCoordinates } from '../../public/maps/map-modes/search-map.js'
import { changeMapMode, currentMapMode, changeRadius, updateRadiusUtils, currentRadius } from '../../public/maps/map-utils.js'
import UtilsComponent from '../components/UtilsComponent.vue'

export default {
  name: 'MapPage',
  data() {
    return {
      currentRadius: 10000,
      previousRadius: '',
      currentTravelMode: 'DRIVING',
      previousTravelMode: '',
      selectedMode: 'NEARBY' // This varible is needed to register current mode in thr HTML above, when 'currentMapMode' from map-utils.js cannot be read at instantiation of app
    }
  },
  created() {
    this.initializePlaceAPI()
    this.initializeNearbyMap()
  },
  methods: {
    changeSearchRange() {
      // Dropdown button is pressed to change radius of displayed clinics
      if (UtilsComponent.methods.checkIfDropdownPressed(this.currentRadius, this.previousRadius)) {
        changeRadius(this.currentRadius)
        this.previousRadius = this.currentRadius

        deselectClinicMarker()

        if (currentMapMode === 'NEARBY') {
          drawNearbyMap()
        } else {
          updateRadiusUtils(service, searchMap, markerCoordinates, currentRadius)
        }
      }
    },
    changeTravelMode() {
    // Dropdown button is pressed to change the display of travel-route types in 'NEARBY' mode
      if (UtilsComponent.methods.checkIfDropdownPressed(this.currentTravelMode, this.previousTravelMode)) {
        changeTravelMode(this.currentTravelMode)
        calcRoute(userGlobalCoordinates, selectedDentalClinicMarker, directionsService, directionsRenderer)
      }
    },
    nearbyMode() {
      this.updateMode('NEARBY')
      initMap()
    },
    searchMode() {
      this.updateMode('SEARCH')
      setTimeout(initSearchMap, 0)
    },
    updateMode(newMode) {
      this.selectedMode = newMode
      changeMapMode(newMode)
    },
    // Run 'nearby-map.js'
    initializeNearbyMap() {
      UtilsComponent.methods.createHTMLScriptElement('../../public/maps/map-modes/nearby-map.js', false)
    },

    /*
    Note for developers: If we want to activate 'SEARCH' mode at start of aplication,
    we run this method in 'created()' instead of the method above, and change
    'currentMapMode' in map-utils.js to 'SEARCH'
    */
    initializeSearchMap() { // Run 'search-map.js'
      UtilsComponent.methods.createHTMLScriptElement('../../public/maps/map-modes/search-map.js', false)
    },
    initializePlaceAPI() {
      UtilsComponent.methods.createHTMLScriptElement('https://maps.googleapis.com/maps/api/js?key=AIzaSyBezKgTO8Fu1ymaIoAoToNn0g5ZMjgSR4Y&libraries=places&callback=initMap', true)
    }
  }
}
</script>
