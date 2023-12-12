<template>
    <div class="accordion" role="tablist">
        <b-card no-body class="mb-1">
            <b-button block v-b-toggle="accordionID" variant="info">
                {{ formatStartTime }} - {{ formatEndTime }}
            </b-button>
            <b-collapse :id="accordionID" :visible="false" accordion="timeslot-accordion" role="tabpanel">
                <b-card-body>

                    <b-card-text><strong>Dentist:</strong> {{ dentistName }}</b-card-text>
                    <b-card-text><strong>Clinic:</strong> {{ clinicName }} </b-card-text>

                    <div class="d-flex justify-content-center">
                        <b-button @click="createBooking">
                            Make appointment
                        </b-button>
                    </div>
                </b-card-body>
            </b-collapse>
        </b-card>
        <!----make appointment modal---->
        <b-modal :id="bookingModalID">{{ bookingOutcomeText }}</b-modal>
    </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import dateFormat, { masks } from 'dateformat'
import { bookAppointment } from '@/utility/timeslotUtils.js'
export default {
  name: 'timeslotCard',
  props: {
    availableTime: {
      type: Object,
      required: true
    },
    dentistName: {
      type: String,
      required: true
    },
    clinicName: {
      type: String,
      required: true
    }
  },
  computed: {
    accordionID() {
      return 'accordion' + this.availableTime._id
    },
    bookingModalID() {
      return 'modalBooking' + this.availableTime._id
    },
    formatStartTime() {
      return dateFormat(this.availableTime.Start_time, 'dddd, mmmm dS, h:MM TT')
    },
    formatEndTime() {
      return dateFormat(this.availableTime.End_time, 'dddd, mmmm dS, h:MM TT')
    }
  },
  data() {
    return {
      bookingOutcomeText: ''
    }
  },
  methods: {
    async createBooking() {
      try {
        const res = await bookAppointment(this.availableTime._id)

        if (res.status === 201 || res.status === 200) {
          this.$bvModal.show(this.bookingModalID)
          this.bookingOutcomeText = 'Booking succesfully created'
          this.$emit('bookedAppointment', this.availableTime._id)
        } else {
          this.bookingOutcomeText = 'Could not book this appointment'
        }
      } catch (err) {
        console.error(err)
      }
    }
  }
}
</script>

<style scoped>
.accordion {
    width: 30vw;
    margin: auto;
}
</style>
