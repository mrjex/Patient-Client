<template>
    <div class="container-fluid text-center">
        <b-spinner variant="success" v-if="!finishedLoading">
        </b-spinner>
        <b-card-body>

            <b-card-text v-if="!availableTimes"><strong>No available times found </strong></b-card-text>

        </b-card-body>
        <timeslotCard v-for="availableTime in availableTimes" :key="availableTime._id" :availableTime="availableTime">
        </timeslotCard>
    </div>
</template>

<script>
/* This component expects a dentist_id passed to it as a prop, it will then display all available times for that dentist */
import timeslotCard from './timeslotCard.vue'
import { getFreeTimeslots } from '@/utility/timeslotUtils.js'
export default {
  name: 'timeslotAccordion',
  props: {
    dentist_id: {
      type: String,
      required: true
    }
  },
  components: {
    timeslotCard
  },
  data() {
    return {
      availableTimes: [],
      finishedLoading: false
    }
  },
  mounted() {
    this.getDentistTimeslots()
  },
  methods: {
    async getDentistTimeslots() {
      try {
        const res = await getFreeTimeslots(this.dentist_id)

        this.availableTimes = res.data.availabletimes
        console.log(this.availableTimes)
        this.finishedLoading = true
      } catch (err) {
        console.error(err)
      }
    }
  }
}
</script>

<style scoped>
.spinner-container {}
</style>
