<template>
  <body>
      <div>
        <MapComponent/>
        <!-- <InfoWindowComponent id="infowindow"/> -->
    </div>
  </body>
</template>

<script>
import MapComponent from '../components/MapComponent.vue'
// import InfoWindowComponent from '../components/InfoWindowComponent.vue'

export default {
  name: 'MapPage',
  data() {
    return {
    }
  },
  created() {
  },
  components: {
    MapComponent
    // InfoWindowComponent
  }
}

</script>

<style scoped>
#infowindow {
  display: flex;
  justify-content: flex-start;
}
</style>
