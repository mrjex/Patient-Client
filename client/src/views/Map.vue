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

    <!-- SEARCH MODE UI-->
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

    <!--
      <script
      src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBezKgTO8Fu1ymaIoAoToNn0g5ZMjgSR4Y&callback=initMap&libraries=places&v=weekly"
      defer
    ></script>
    -->
    <!-- SEARCH MODE -->
    </div>
  </div>
</template>

<script>
// import axios from 'axios'
import { calcRoute, userGlobalCoordinates, selectedDentalClinicMarker, directionsService, directionsRenderer, drawMap, initMap, changeTravelMode } from '../../public/maps/map-modes/nearby-map.js'
import { updateRadiusSearch, initSearchMap } from '../../public/maps/map-modes/search-map.js'
import { changeMapMode, currentMapMode, changeRadius } from '../../public/maps/map-utils.js'

// import UtilsComponentVue from '../components/UtilsComponent.vue'

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
    // NOTE: Refactor this by creating 'UtilsComponent.vue', import it as a component in this vue-script, and call its corresponding method
    changeSearchRange() {
      if (this.currentRadius && this.currentRadius !== this.previousRadius) {
        changeRadius(this.currentRadius)
        this.previousRadius = this.currentRadius

        if (currentMapMode === 'NEARBY') { // map-utils.js - confirmExecutionCondition()
          drawMap()
        } else {
          updateRadiusSearch()
        }
      }

      // NOTE: Refactor later
      // UtilsComponentVue.methods.modifyHTMLOnVariableChange(this.currentRadius, this.previousRadius)
      // updateMap() ---> Must be within if-statement --> Must be invoked in 'UtilsComponent.vue'
    },
    changeTravelMode() {
      if (this.currentTravelMode && this.currentTravelMode !== this.previousTravelMode) { // TODO: 'previousTravelMode' variable becomes redundant when switching to bootstrap dropdown
        changeTravelMode(this.currentTravelMode)
        calcRoute(userGlobalCoordinates, selectedDentalClinicMarker, directionsService, directionsRenderer)
      }

      // NOTE: Refactor later
      // UtilsComponentVue.methods.modifyHTMLOnVariableChange(this.currentTravelMode, this.previousTravelMode, 'travel-mode-data')
      // updateTravelMode()
    },
    nearbyMode() {
      this.updateMode('NEARBY')
      initMap()
    },
    searchMode() {
      this.updateMode('SEARCH')
      setTimeout(initSearchMap, 0) // Passing the method as a callback solves the bug of blocking searchbar
    },
    updateMode(newMode) {
      this.selectedMode = newMode
      changeMapMode(newMode)
    },
    // Run 'nearby-map.js' that has responsibility for the backend functionality of the API
    initializeNearbyMap() {
      const scriptMapAPI = document.createElement('script')
      scriptMapAPI.type = 'module'
      scriptMapAPI.src = '../../public/maps/map-modes/nearby-map.js'
    },
    // Note for developers: If we want to activate 'SEARCH' mode at start of aplication,
    // we run this method in 'created()' instead of the method above, and change
    // 'currentMapMode' in map-utils.js to 'SEARCH
    initializeSearchMap() {
      const scriptSearchMapAPI = document.createElement('script')
      scriptSearchMapAPI.type = 'module'
      scriptSearchMapAPI.src = '../../public/maps/map-modes/search-map.js'
    },
    initializePlaceAPI() {
      const scriptPlaceAPI = document.createElement('script')
      scriptPlaceAPI.type = 'module'
      scriptPlaceAPI.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBezKgTO8Fu1ymaIoAoToNn0g5ZMjgSR4Y&libraries=places&callback=initMap'
      document.head.prepend(scriptPlaceAPI)
    }
  }
}
</script>
