<template>
    <div class="container-fluid">
        <div class="input-div">
            <b-form-input class="input-box m-3" v-model="dentistID" placeholder="Enter dentistID">
            </b-form-input>
            <b-button class="mb-3" @click="getDentistTimeslots">Get timeslots</b-button>
        </div>

        <timeslotCard v-for="timeslot in timeslots" :key="timeslot._id" :timeslot="timeslot">

        </timeslotCard>
    </div>
</template>

<script>
import timeslotCard from './timeslotCard.vue'
import { getFreeTimeslots } from '@/utility/timeslotUtils.js'
export default {
  name: 'timeslotAccordion',
  components: {
    timeslotCard
  },
  data() {
    return {
      timeslots: [],
      dentistID: ''
    }
  },
  methods: {
    async getDentistTimeslots() {
      try {
        const res = await getFreeTimeslots(this.dentistID)

        this.timeslots = res.data.AvailableTimes
        console.log(this.timeslots)
      } catch (err) {
        console.error(err)
      }
    }
  }
}
</script>

<style scoped>
.input-div {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}
.input-box {
    width: 20vw;
}
</style>
