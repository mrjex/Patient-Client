<template>
  <div class="container-fluid">
    <b-spinner variant="success" v-if="!finishedLoading">
    </b-spinner>
    <b-card-body>

      <b-card-text v-if="!availableTimes"><strong>No available times found </strong></b-card-text>

    </b-card-body>
    <b-card no-body>
      <b-button variant="light" @click="$emit('showDentists')">
        {{ resetText }}
      </b-button>
    </b-card>
    <timeslotCard v-for="availableTime in availableTimes" :key="availableTime._id" :availableTime="availableTime"
      :dentistName="dentist.username" @bookedAppointment="deleteAvailableTimes"
      @bookingFailed="$bvModal.show('failedModal')">
    </timeslotCard>

    <!----booking outcome modal---->
    <b-modal :id="'successModal'" ok-only title="Success">
      <p>Appointment created</p>
    </b-modal>
    <b-modal :id="'failedModal'" ok-only title="Request failed">
      <p>Unable to book appointment</p>
    </b-modal>
  </div>
</template>

<script>
/* This component expects a dentist_id passed to it as a prop, it will then display all available times for that dentist */
import timeslotCard from './timeslotCard.vue'
import { getFreeTimeslots } from '@/utility/timeslotUtils.js'
export default {
  name: 'timeslotAccordion',
  props: {
    dentist: {
      type: Object,
      required: true
    }
  },
  components: {
    timeslotCard
  },
  data() {
    return {
      availableTimes: [],
      finishedLoading: false,
      resetText: 'Back to Dentists..'
    }
  },
  mounted() {
    this.getDentistTimeslots()
  },
  methods: {
    async getDentistTimeslots() {
      try {
        const res = await getFreeTimeslots(this.dentist._id)

        this.availableTimes = res.data.availabletimes
        this.finishedLoading = true
      } catch (err) {
        console.error(err)
      }
    },
    async deleteAvailableTimes(availableTimeId) {
      try {
        this.availableTimes = this.availableTimes.filter(item => item._id !== availableTimeId)
      } catch (err) {
        console.error(err)
      }
      this.$bvModal.show('successModal')
    }
  }
}
</script>

<style scoped></style>
