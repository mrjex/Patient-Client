<template>
    <div class="accordion" role="tablist">
        <b-card no-body class="mb-1">
            <b-button block v-b-toggle="accordionID" variant="info">
                {{ formatStartTime }} - {{ formatEndTime }}
            </b-button>
            <b-collapse :id="accordionID" :visible="false" accordion="timeslot-accordion" role="tabpanel">
                <b-card-body>

                    <b-card-text><strong>Dentist:</strong> Place Holderson</b-card-text>
                    <b-card-text><strong>Clinic:</strong> Working from home </b-card-text>
                    <b-card-text><strong>Adress:</strong> Lindholmen </b-card-text>

                    <div class="d-flex justify-content-center">
                        <b-button v-b-modal="createBookingModalID">
                            Make appointment
                        </b-button>
                    </div>
                </b-card-body>
            </b-collapse>
        </b-card>
        <!----make appointment modal---->
        <b-modal :id="createBookingModalID">This doesn't work yet</b-modal>
    </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import dateFormat, { masks } from 'dateformat'
export default {
  name: 'timeslotCard',
  props: {
    availableTime: {
      type: Object,
      required: true
    }
  },
  computed: {
    accordionID() {
      return 'accordion' + this.availableTime._id
    },
    createBookingModalID() {
      return 'modalBooking' + this.availableTime._id
    },
    formatStartTime() {
      return dateFormat(this.availableTime.Start_time, 'dddd, mmmm dS, h:MM TT')
    },
    formatEndTime() {
      return dateFormat(this.availableTime.End_time, 'dddd, mmmm dS, h:MM TT')
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
