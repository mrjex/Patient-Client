<template>
  <div class="ui grid map-vue">
    <div class="six wide column">
      <form class="ui segment large form">
        <div class="field">
          <div class="two fields">
            <div class="field map-vue-radius-options">
              <select v-model="currentRadius" @click.prevent="changeSearchRange">
                <option value="5000">5 KM</option>
                <option value="10000">10 KM</option>
                <option value="15000">15 KM</option>
                <option value="20000">20 KM</option>
                <option value="30000">30 KM</option>
                <option value="50000">50 KM</option>
                <option value="100000">100 KM</option>
              </select>
            </div>
          </div>
        </div>
        <!-- <button class="ui button pink" @click.prevent="findCloseBuyButtonPressed">Find CloseBuy</button> -->
      </form>
    </div>

    <div>
      <strong>Mode of Travel: </strong>
      <select v-model="currentTravelMode" id="mode" @click.prevent="changeTravelMode">
        <option value="DRIVING">Driving</option>
        <option value="WALKING">Walking</option>
        <option value="BICYCLING">Bicycling</option>
        <option value="TRANSIT">Transit</option>
      </select>
    </div>
  </div>
</template>

<script>
// import axios from 'axios'
import { updateMap, updateTravelMode } from '../../public/intermediaryExecutor.js'
// import UtilsComponentVue from '../components/UtilsComponent.vue'

export default {
  name: 'MapPage',
  data() {
    return {
      currentRadius: '',
      previousRadius: '',
      currentTravelMode: '',
      previousTravelMode: ''
    }
  },
  methods: {
    // NOTE: Refactor this by creating 'UtilsComponent.vue', import it as a component in this vue-script, and call its corresponding method
    changeSearchRange() {
      if (this.currentRadius && this.currentRadius !== this.previousRadius) {
        const radiusArticle = document.getElementById('radius-data')
        radiusArticle.innerHTML = this.currentRadius
        this.previousRadius = this.currentRadius
        updateMap()
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

        // NOTE: Updating the entire map is not smooth and ideal when only wanting to change route
        // SOLUTION: use intermediaryExecutor.js with 'calcRoute()'
        // updateMap()
        updateTravelMode()
      }

      // NOTE: Refactor later
      // UtilsComponentVue.methods.modifyHTMLOnVariableChange(this.currentTravelMode, this.previousTravelMode, 'travel-mode-data')
      // updateTravelMode()
    }
  }
}

</script>
