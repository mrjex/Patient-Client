<template>
  <div class="container-fluid">
    <!----loading spinner
    <b-spinner variant="success" v-if="!finishedLoading">
    </b-spinner> ---->
    <b-card-body>

      <b-card-text v-if="!availableTimes"><strong>No available times found </strong></b-card-text>

    </b-card-body>
    <b-card no-body>
      <b-button variant="light" @click="$emit('showClinics')">
        {{ resetText }}
      </b-button>
    </b-card>
    <timeslotCard v-for="availableTime in availableTimes" :key="availableTime._id" :availableTime="availableTime"
      @bookedAppointment="deleteAvailableTimes"
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
export default {
  name: 'timeslotAccordion',
  props: {
    availableTimes: {
      type: Array,
      required: true
    }
  },
  components: {
    timeslotCard
  },
  data() {
    return {
      resetText: 'Back to Clinics'
    }
  },
  computed: {
    finishedLoading() {
      if (this.availableTimes.length > 0) {
        return true
      } else {
        return false
      }
    }
  },
  mounted() {
  },
  methods: {
    async deleteAvailableTimes(availableTimeId) {
      this.$emit('deleteAvailableTime', availableTimeId)
      this.$bvModal.show('successModal')
    }
  }
}
</script>

<style scoped></style>
