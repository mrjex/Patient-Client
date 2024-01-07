<template>
  <body>
    <div class="flex-container">

      <div class="m-2">
        <h1>Find a Clinic</h1>
      </div>

      <div class="d-flex mb-3">
        <timeSpanModal @selectedTime="handleSelectedTime" v-if="!displayTimeslots" />
      </div>

      <div class="container-fluid">
        <!--clinic list component-->
        <clinicList v-if="displayClinics" @clinicClick="handleClinicClick" :clinics="clinics"></clinicList>

        <!--timeslot list component-->
        <div>
          <timeslotAccordion v-if="displayTimeslots" :availableTimes="availableTimes" @showClinics="handleDisplayClinics"
            @deleteAvailableTime="handleDeleteAvailableTime">
          </timeslotAccordion>
        </div>

        <!--No clinics to show-->
        <div v-if="clinics.length < 1" class="text-center">
          <b-card no-body>
            <b-card-text>
              <p>No clinics to show <br> try changing your search parameters</p>
              <div class="image-container"><img src="../assets/sad-face.svg" alt=""></div>
            </b-card-text>
          </b-card>
        </div>

      </div>

    </div>
  </body>
</template>

<script>
import clinicList from '../component/clinics/ClinicList.vue'
import timeslotAccordion from '../component/timeslots/timeslotAccordion.vue'
import timeSpanModal from '../component/timeslots/timeSpanModal.vue'
import { getAllClinics, getClinic, getNclosestClinics } from '@/utility/clinicUtils'
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
      displayClinics: false,
      displayTimeslots: false,
      resetText: 'Show Clinics',
      availableTimes: [],
      userLocation: null
    }
  },
  methods: {
    handleClinicClick() {
      this.displayClinics = false
      this.displayTimeslots = true
    },
    handleDisplayClinics() {
      this.displayClinics = true
      this.displayTimeslots = false
      this.availableTimes = []
    },
    async getTimeSpanAppointments(timeSpan) {
      try {
        const clinicIds = []
        this.clinics.forEach((clinic) => {
          clinicIds.push(clinic._id.$oid)
        })
        const res = await getTimeWindowTimeSlots(clinicIds, timeSpan)
        if (res.data.availabletimes) {
          this.availableTimes = res.data.availabletimes
          this.availableTimes.forEach((availableTime) => {
            this.clinics = this.clinics.filter((clinic) => clinic._id.$oid === availableTime.clinic_id)
          })
          this.displayClinics = true
        } else {
          this.clinics = []
          this.$bvModal.show('noTimeslotsModal')
        }
      } catch (err) {
        console.error(err)
      }
    },
    async handleSelectedTime(filter) {
      this.getTimeSpanAppointments(filter.timespan)
      if (filter.filterOptions === 'closest') {
        this.getClosestClinics()
      } else {
        this.getClinics()
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
    },
    getUserLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.userLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
        })
      } else {
        console.log('Geolocation failed.')
      }
    },
    async getClosestClinics() {
      try {
        const coordinates = this.userLocation.latitude + ',' + this.userLocation.longitude
        const res = await getNclosestClinics(coordinates, 10)
        this.clinics = res.data.clinics
      } catch (err) {
        console.error(err)
      }
    }
  },
  mounted() {
    this.getUserLocation()
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

.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
