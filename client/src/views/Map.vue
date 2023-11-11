<template>
  <div class="ui grid map-vue">
    <div class="six wide column">
      <form class="ui segment large form">
        <!-- NOTE: Integrate this with functionality in map.js via latitude and longitude -->
        <div class="field">
          <div class="two fields">
            <div class="field map-vue-radius-options">
              <select v-model="radius" @click.prevent="test123">
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

    <!-- <input id="searchTextField" type="text" size="50" @click.prevent="registerInputSearchField"> -->

    <div>
      <strong>Mode of Travel: </strong>
      <select id="mode" onchange="calcRoute();">
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
    test123() {
      // NOTE: Add previous- and current value comparisons to avoid double-click bug
      if (this.radius) { // NOTE: Avoid scenario where radius is null that occurs at the first interaction since application was started - Set default value to prevent this later
        const radiusArticle = document.getElementById('radius-data')
        radiusArticle.innerHTML = this.radius
        // navigator.geolocation.clearWatch()
        // setTimeout(navigator.geolocation.clearWatch(), 10)
        // navigator.geolocation.clearWatch(document.getElementById('watch-id-data').innerHTML)
      }
    }
  }
}

</script>
