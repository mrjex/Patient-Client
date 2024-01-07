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
      clinics: [],
      updateInterval: 100,
      previousClinicRequest: ''
    }
  },
  methods: {
    checkClinicRequest() {
      if (clinicsData) {
        return clinicsData.clinics === this.previousClinicRequest ? 'false' : 'true'
      }
      return 'false'
    },
    initiateClinicMapRequestListener() {
      setInterval(
        () => {
          const updateClinicListUI = this.checkClinicRequest()
          if (updateClinicListUI === 'true') {
            this.previousClinicRequest = clinicsData.clinics
            this.clinics = clinicsData.clinics
          }
        },
        this.updateInterval
      )
    }
  },
  created() {
    this.initiateClinicMapRequestListener()
  },
  components: {
    MapComponent,
    ClinicList
  }
}
</script>
