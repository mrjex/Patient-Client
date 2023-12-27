<template>
  <body>
      <div>
        <MapComponent/>
        <!-- <InfoWindowComponent /> -->
    </div>
  </body>
</template>

<script>
import MapComponent from '../components/MapComponent.vue'
// import InfoWindowComponent from '../components/InfoWindowComponent.vue'

export default {
  name: 'MapPage',
  components: {
    MapComponent
    // InfoWindowComponent
  }
}

</script>
