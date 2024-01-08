<template>
  <body>
    <div>
      <MapComponent />
    </div>
    <div class="d-flex justify-content-center align-items-center">
      <div class="flex-container">
        <timeSpanModal class="mb-3" @selectedTime="handleFilterTimes" />
        <ClinicList :clinics="clinics" v-if="showClinicList" @clinicClick="handleClinicClick" class="clinicList" />
        <timeslotAccordion :availableTimes="filteredAvailableTimes" v-if="showTimeslots"
          @showClinics="handleDisplayClinics" @deleteAvailableTime="handleDeleteAvailableTime"/>

        <!--No matching timeslots modal-->
        <b-modal id="noTimesFound" ok-only title="No matching times found">
          <p>No available times for selected clinics found</p>
          <br>
          <p>Try updating search criteria</p>
        </b-modal>
      </div>
    </div>

  </body>
</template>

<script>
import MapComponent from '../components/MapComponent.vue'
import ClinicList from '../component/clinics/ClinicList.vue'
import { clinicsData, drawClinicMarkers } from '../../public/maps/map-utils.js'
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
    handleDeleteAvailableTime(availableTimeId) {
      this.availableTimes = this.availableTimes.filter((availableTime) => availableTime._id !== availableTimeId)
    },
    async handleFilterTimes(filter) {
      try {
        const clinicIds = []
        this.clinics.forEach((clinic) => {
          clinicIds.push(clinic._id.$oid)
        })
        const res = await getTimeWindowTimeSlots(clinicIds, filter.timespan)
        if (res.data.availabletimes) {
          this.availableTimes = res.data.availabletimes
          const availableClinicIds = new Set(this.availableTimes.map(at => at.clinic_id))
          this.clinics = this.clinics.filter(clinic => availableClinicIds.has(clinic._id.$oid))

          const clinicIDsFilteredByTimeslot = new Set()
          res.data.availabletimes.forEach((clinic) => {
            clinicIDsFilteredByTimeslot.add(clinic.clinic_id)
          })

          drawClinicMarkers(clinicIDsFilteredByTimeslot)
        } else if (res.data.availabletimes === null || res.data.availabletimes.length === 0) {
          this.$bvModal.show('noTimesFound')
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
  min-width: 40vw;
  max-height: fit-content;
}

.clinicList {
  max-height: 50vh;
  overflow: auto;
}
</style>
