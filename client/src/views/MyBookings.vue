<template>
<!--Wireframe - https://git.chalmers.se/courses/dit355/2023/student-teams/dit356-2023-20/group-20-distributed-systems/-/wikis/Patient-gui#my-bookings -->
  <body>
    <b-container>
      <b-row>
        <!-- Use v-for to loop through appointments and create a b-card for each one -->
        <b-col v-for="(appointment, index) in appointments" :key="index">
          <b-card>
            <!-- Display the start time and end time as the card title -->
            <b-card-title>{{ formatDateRange(appointment.start_time, appointment.end_time) }}</b-card-title>
            <b-button variant="danger" @click="cancelAppointment(appointment._id)">
        Cancel Appointment
      </b-button>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </body>
</template>

<script>
import { getAppointments, cancelAppointment } from '@/utility/timeslotUtils.js'

export default {
  name: 'MyBookings.vue',
  data() {
    return {
      appointments: [],
      finishedLoading: false
    }
  },
  mounted() {
    this.getAppointments()
  },
  methods: {
    async getAppointments() {
      try {
        const res = await getAppointments()

        this.appointments = res.data.appointments
        this.finishedLoading = true
      } catch (error) {

      }
    },
    formatDateRange(start, end) {
      // Parse the start and end dates
      const startDate = new Date(start)
      const endDate = new Date(end)

      // Format the dates as desired
      const formattedStart = `${startDate.getDate()}/${startDate.getMonth() + 1} -${String(startDate.getFullYear()).slice(2)} ${String(startDate.getHours()).padStart(2, '0')}:${String(startDate.getMinutes()).padStart(2, '0')}`
      if (
        startDate.getDate() === endDate.getDate() &&
        startDate.getMonth() === endDate.getMonth() &&
        startDate.getFullYear() === endDate.getFullYear()
      ) {
        // If same date, display only the time
        return `${formattedStart} ${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`
      } else {
        // If different date, display both date and time
        const formattedEnd = `${endDate.getDate()}/${endDate.getMonth() + 1} -${String(endDate.getFullYear()).slice(2)} ${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`
        return `${formattedStart} ${formattedEnd}`
      }
    },
    async cancelAppointment(appointmentId) {
      try {
        const res = await cancelAppointment(appointmentId)
        console.log('res')
        if (res.status === 200) {
          this.appointments = this.appointment.filter((appointment) => appointment._id === appointmentId)
        }
      } catch (error) {
        console.log('Error')
      }
    }
  }
}
</script>

<style scoped>

</style>
