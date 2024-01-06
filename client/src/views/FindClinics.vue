<template>
  <body>
    <div class="flex-container">
      <div class="m-2">
        <h1>Find a Clinic</h1>
      </div>
      <b-button @click="getClinics">
        Show all Clinics
      </b-button>
      <timeSpanModal @selectedTime="handleSelectedTime" />

      <div class="container-fluid">
        <!--clinic list component-->
        <clinicList v-if="displayClinics" @clinicClick="handleClinicClick" :clinics="clinics"></clinicList>

        <!--timeslot list component-->
        <div>
          <timeslotAccordion v-if="displayTimeslots"
          :availableTimes="availableTimes"
          @showClinics="handleDisplayClinics"
          @deleteAvailableTime="handleDeleteAvailableTime">
          </timeslotAccordion>
        </div>

      </div>
    </div>
  </body>
</template>

<script>
import clinicList from '../component/clinics/ClinicList.vue'
import timeslotAccordion from '../component/timeslots/timeslotAccordion.vue'
import timeSpanModal from '../component/timeslots/timeSpanModal.vue'
import { getAllClinics, getClinic } from '@/utility/clinicUtils'
import { getTimeWindowTimeSlots } from '@/utility/timeslotUtils'

export default {
  name: 'ClinicsView',
  components: {
    clinicList,
    timeslotAccordion,
    timeSpanModal
  },
  data() {
    return {
      employees: [],
      clinics: [],
      displayClinics: true,
      displayTimeslots: false,
      resetText: 'Show Clinics',
      availableTimes: []
    }
  },
  methods: {
    handleClinicClick(clinic) {
      this.displayClinics = false
      this.displayTimeslots = true
    },
    handleDisplayClinics() {
      this.displayClinics = true
      this.displayTimeslots = false
    },
    async handleSelectedTime(timeSpan) {
      /* get timeslots for selected time span then extract clinic ids and add clinics to clinics array,
      ss
  */
      try {
        const clinicIds = []
        this.clinics.forEach((clinic) => {
          clinicIds.push(clinic._id.$oid)
        })
        const res = await getTimeWindowTimeSlots(clinicIds, timeSpan)
        console.log(res.data)
        this.availableTimes = res.data.availabletimes
        this.availableTimes.forEach((availableTime) => {
          this.clinics = this.clinics.filter((clinic) => clinic._id.$oid === availableTime.clinic_id)
        })
      } catch (err) {
        console.error(err)
      }
    },
    async getClinics() {
      try {
        const res = await getAllClinics()
        this.clinics = res.data.clinics
      } catch (err) {
        console.error(err)
      }
    },
    async getClinic(clinicId) {
      try {
        const res = await getClinic(clinicId)
        this.clinics.push(res.data.clinic)
      } catch (err) {
        console.error(err)
      }
    },
    handleDeleteAvailableTime(availableTimeId) {
      this.availableTimes = this.availableTimes.filter((availableTime) => availableTime._id !== availableTimeId)
    }
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
}

.container-fluid {
  max-width: 100%;
  width: 70vb;
  min-width: fit-content;
}
</style>
