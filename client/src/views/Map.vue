<template>
  <div class="ui grid map-vue">
      <div class="field map-vue-radius-options">

        <!-- TODO: Add place holders in all input fields in this vue file-->
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

    <div>
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
      <button type="button" class="btn btn-success" @click.prevent="searchMode">SEARCH / DISCOVER</button>
    </div>

    <!-- SEARCH MODE UI-->
    <div class="map-search-mode" v-if="this.selectedMode === 'SEARCH'">
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
import { updateMap, updateTravelMode, updateSearchMap, updateTravelModeSearch, updateRadiusSearchIntermediary, markerCoordinates } from '../../public/intermediaryExecutor.js'
// import UtilsComponentVue from '../components/UtilsComponent.vue'

export default {
  name: 'MapPage',
  data() {
    return {
      currentRadius: '',
      previousRadius: '',
      currentTravelMode: '',
      previousTravelMode: '',
      selectedMode: 'NEARBY' // The necessity in this variable is solely to counteract the error when initializing the program, where there is no instance of 'mode-data' HTML element
    }
  },
  methods: {
    // NOTE: Refactor this by creating 'UtilsComponent.vue', import it as a component in this vue-script, and call its corresponding method
    changeSearchRange() {
      if (this.currentRadius && this.currentRadius !== this.previousRadius) {
        const radiusArticle = document.getElementById('radius-data')
        radiusArticle.innerHTML = this.currentRadius
        this.previousRadius = this.currentRadius

        if (document.getElementById('mode-data').innerHTML === 'NEARBY') { // NOTE: Refactor into seperate .js files later
          updateMap()
        } else {
          // updateSearchMap()
          console.warn('update search radius intermediary')
          updateSearchMap(500, markerCoordinates)
          // updateRadiusSearchIntermediary()
        }
      }

      // NOTE: Refactor later
      // UtilsComponentVue.methods.modifyHTMLOnVariableChange(this.currentRadius, this.previousRadius, 'radius-data')
      // updateMap() ---> Must be within if-statement --> Must be invoked in 'UtilsComponent.vue'
    },
    changeTravelMode() {
      if (this.currentTravelMode && this.currentTravelMode !== this.previousTravelMode) {
        const travelModeArticle = document.getElementById('travel-mode-data')
        travelModeArticle.innerHTML = this.currentTravelMode
        this.previousTravelMode = this.currentTravelMode

        if (document.getElementById('mode-data').innerHTML === 'NEARBY') { // NOTE: Refactor into a new .js file that supports reusability search-map.js and map.js
          updateTravelMode()
        } else {
          updateTravelModeSearch()
        }
      }

      // NOTE: Refactor later
      // UtilsComponentVue.methods.modifyHTMLOnVariableChange(this.currentTravelMode, this.previousTravelMode, 'travel-mode-data')
      // updateTravelMode()
    },
    nearbyMode() {
      this.updateMode('NEARBY')
      updateMap()
    },
    searchMode() {
      this.updateMode('SEARCH')
      updateSearchMap(0, -1)
    },
    updateMode(newMode) {
      document.getElementById('mode-data').innerHTML = newMode
      this.selectedMode = newMode
    }
  }
}

</script>
