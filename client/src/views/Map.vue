<script>
import { computed } from 'vue'
// import { useGeoLocation } from '../useGeolocation'
import { onUnmounted, onMounted, ref } from '@vue/runtime-core'
// import { Loader } from '@googlemaps/js-api-loader'

export default {
  name: 'MapPage',

  /*
  NOTE: 'setup()' is only supported by Vue3
  setup() {
    const { coords } = useGeoLocation()
    const currentPosition = computed(() => ({
      lat: coords.value.latitude,
      lng: coords.value.longitude
    }))
    return { currentPosition }
  }
  */
  data() {
    return {
      currentPosition: ''
    }
  },
  /*
  computed: {
    getGeoLocation2: function () {
    }
  },
  */
  created() {
    // NOTE: If currentPosition doesn't update, try updateInterval()

    // IDEA 1: Make useGeolocation a vue component, import it here and its method
    // IDEA 2: Create useGeolocation JS function in this document under <script>

    /*
    const { coords } = useGeoLocation()
    this.currentPosition = computed(() => ({
      lat: coords.value.latitude,
      lng: coords.value.longitude
    }))
    */

    const { coords } = this.useGeolocation2()
    console.warn(coords.value)
    this.currentPosition = computed(() => ({
      lat: coords.value.latitude,
      lng: coords.value.longitude
    }))
  },
  methods: {
    useGeolocation2() {
      const coords = ref({ latitude: 0, longitude: 0 })
      const isSupported = 'navigator' in window && 'geolocation' in navigator

      // Update coordinates
      let watcher = null
      onMounted(() => {
        if (isSupported) {
          watcher = navigator.geolocation.watchPosition(
            position => (coords.value = position.coords)
          )
        }
      })

      onUnmounted(() => {
        if (watcher) {
          navigator.geolocation.clearWatch(watcher)
        }
      })

      return { coords }
    }
  }
}
</script>

<template>
  <div>
    <h1>Yo</h1>
    <h2>Your Position</h2>
    <!--
    Latitude: {{ currentPosition.lat.toFixed(2) }},
    Longitude: {{ currentPosition.lng.toFixed(2) }}
    -->
  </div>
</template>
