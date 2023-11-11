<template>
  <div class="ui grid">
    <div class="six wide column">
      <form class="ui segment large form">
        <div class="field">
          <div class= "ui right icon input large">
            <input type="text" placeholder="Enter your address" v-model="coordinates">
            <button type="button" class="btn btn-primary" @click.prevent="locatorButtonPressed">Get Your Coordinates</button>
          </div>
        </div>

        <!-- NOTE: Integrate this with functionality in map.js via latitude and longitude -->
        <div class="field">
          <div class="two fields">
            <div class="field">
              <select v-model="type">
                <option value="dentist">Denstist</option>
              </select>
            </div>

            <div class="field">
              <select v-model="radius">
                <option value="5">5 KM</option>
                <option value="10">10 KM</option>
                <option value="15">15 KM</option>
                <option value="20">20 KM</option>
              </select>
            </div>
          </div>
        </div>
        <!-- <button class="ui button pink" @click.prevent="findCloseBuyButtonPressed">Find CloseBuy</button> -->
      </form>
    </div>

    <!-- <input id="searchTextField" type="text" size="50" @click.prevent="registerInputSearchField"> -->
  </div>
</template>

<script>
// import axios from 'axios'

export default {
  name: 'MapPage',
  data() {
    return {
      currentPosition: '',
      type: '',
      radius: '',
      lat: 0,
      lng: 0,
      service: '',
      infoWindow: ''
    }
  },
  created() {
  },
  methods: {
    locatorButtonPressed() {
      navigator.geolocation.getCurrentPosition(
        // Success callback: Assign coordinate-values to properties
        position => {
          this.lat = position.coords.latitude
          this.lng = position.coords.longitude
        },
        error => {
          console.warn('Error getting location:' + error.message)
        }
      )
    },
    registerInputSearchField() {
      /*
      const inputTest = document.getElementById('searchTextField')
      console.warn(inputTest)

      // NOTE: Replace 'let' with 'const' if not working
      let autocomplete = new google.maps.places.Autocomplete(inputTest)
      autocomplete.bindTo('bounds', document.getElementById('map'))
      */
    }
    // NOTE: If this doesn't work, try tutorial on Google Map Platform (which is up to date)
    // NOTE: Refactor by making API key a global variable
  },
  computed: {
    // Return latitude and longitude in format (n, m)
    coordinates() {
      return `${this.lat}, ${this.lng}`
    }
  }
}
</script>
