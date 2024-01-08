<template>
  <body>
    <div>
      <MapComponent />
    </div>
    <div class="d-flex justify-content-center align-items-center">
      <div class="flex-container">
        <timeSpanModal class="mb-3" @selectedTime="handleFilterTimes" />
        <ClinicList :clinics="clinics" v-if="showClinicList" @clinicClick="handleClinicClick" />
        <timeslotAccordion :availableTimes="filteredAvailableTimes" v-if="showTimeslots"
          @showClinics="handleDisplayClinics" />
      </div>
    </div>

  </body>
</template>

<script>
import MapComponent from '../components/MapComponent.vue'
import ClinicList from '../component/clinics/ClinicList.vue'
import { clinicsData } from '../../public/maps/map-utils.js'
import timeSpanModal from '../component/timeslots/timeSpanModal.vue'
import { getTimeWindowTimeSlots } from '@/utility/timeslotUtils'
import timeslotAccordion from '../component/timeslots/timeslotAccordion.vue'

export default {
  name: 'MapPage',
  data() {
    return {
      clinics: [],
      updateInterval: 100,
      previousClinicRequest: '',
      availableTimes: [],
      showClinicList: true,
      showTimeslots: false,
      selectedClinicId: null
    }
  },
  computed: {
    filteredAvailableTimes() {
      return this.availableTimes.filter((availableTime) => availableTime.clinic_id === this.selectedClinicId)
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
    },
    async handleFilterTimes(filter) {
      try {
        const clinicIds = []
        this.clinics.forEach((clinic) => {
          clinicIds.push(clinic._id.$oid)
        })
        console.log(clinicIds)
        const res = await getTimeWindowTimeSlots(clinicIds, filter.timespan)
        if (res.data.availabletimes) {
          this.availableTimes = res.data.availabletimes
          const availableClinicIds = new Set(this.availableTimes.map(at => at.clinic_id))
          this.clinics = this.clinics.filter(clinic => availableClinicIds.has(clinic._id.$oid))
        }
      } catch (err) {
        console.log(err)
      }
    },
    handleDisplayClinics() {
      this.showClinicList = true
      this.showTimeslots = false
    },
    handleClinicClick(clinicId) {
      this.showClinicList = false
      this.showTimeslots = true
      this.selectedClinicId = clinicId
    }
  },
  created() {
    this.initiateClinicMapRequestListener()
  },
  components: {
    MapComponent,
    ClinicList,
    timeSpanModal,
    timeslotAccordion
  }
}
</script>

<style scoped>
.flex-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  max-height: fit-content;
  min-width: 40vw;
}
</style>
