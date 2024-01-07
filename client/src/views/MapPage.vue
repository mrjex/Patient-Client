<template>
  <body>
      <div>
        <MapComponent/>
      </div>
      <div>
        <ClinicList :clinics="clinics" />
      </div>
  </body>
</template>

<script>
import MapComponent from '../components/MapComponent.vue'
import ClinicList from '../component/clinics/ClinicList.vue'

import { clinicsData } from '../../public/maps/map-utils.js'

export default {
  name: 'MapPage',
  data() {
    return {
      clinics: []
    }
  },
  methods: {
    callbackTest() {
      return clinicsData || -1
    }
  },
  created() {
  },
  async mounted() {
    const refreshId = setInterval(
      () => {
        const currentClinicsData = this.callbackTest()
        if (currentClinicsData !== -1) {
          console.log('clearInterval()')
          clearInterval(refreshId)

          console.log(currentClinicsData)
          this.clinics = currentClinicsData
        }
      },
      100
    )
  },
  components: {
    MapComponent,
    ClinicList
  }
}
</script>
