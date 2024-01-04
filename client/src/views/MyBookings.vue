<template>
<!--Wireframe - https://git.chalmers.se/courses/dit355/2023/student-teams/dit356-2023-20/group-20-distributed-systems/-/wikis/Patient-gui#my-bookings -->
  <body>
    <b-container>
      <b-row>
        <!-- Use v-for to loop through appointments and create a b-card for each one -->
        <b-col v-for="(appointment, index) in appointments" :key="index">
          <b-card class="my-3 custom-rounded-card shadow-lg">
  <!-- Display the start time and end time as the card title -->
            <b-card-title>{{ formatDateRange(appointment.start_time, appointment.end_time).title }}</b-card-title>
              <b-card-sub-title>{{ formatDateRange(appointment.start_time, appointment.end_time).subtitle }}</b-card-sub-title>
              <br/>
              <b-card-sub-title>Click here to find clinic on map!</b-card-sub-title>

                <b-button variant="danger" @click="cancelAppointment(appointment._id, index)">
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
      const formattedStartDate = `${String(startDate.getDate()).padStart(2, '0')}/${String(startDate.getMonth() + 1).padStart(2, '0')} -${String(startDate.getFullYear()).slice(2)}`
      const formattedStartTime = `${String(startDate.getHours()).padStart(2, '0')}:${String(startDate.getMinutes()).padStart(2, '0')}`

      const formattedEndTime = `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`

      // Create the formatted title and subtitle
      const title = `${formattedStartDate}`
      const subtitle = `from: ${formattedStartTime} to: ${formattedEndTime}`

      return { title, subtitle }
    },
    async cancelAppointment(appointmentId, index) {
      try {
        if (await cancelAppointment(appointmentId)) {
          this.appointments.splice(index, 1)
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
