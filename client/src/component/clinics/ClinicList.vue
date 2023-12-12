<template>
  <div class="container-fluid text-center">
    <b-card no-body :v-for="clinic in clinics" :key="clinic._id">
      <b-card-header header-tag="header" class="p-1" role="tab">
        <b-button block v-b-toggle="'clinic' + clinic._id" variant="info">{{ clinic.clinicName }}</b-button>
      </b-card-header>
      <b-collapse :id="'clinic' + clinic._id" visible accordion="my-accordion" role="tabpanel">
        <b-card-body>
          <div v-if="clinic.dentists.length === 0">This clinic has no employees</div>
          <div v-else>
            <dentist v-for="dentist in clinic.dentists"
            :key="dentist._id"
            :dentist="dentist"
            @showTimeslots="handleShowTimeSlots"/>
          </div>
        </b-card-body>
      </b-collapse>
    </b-card>

    <!--TimeslotComponent-->
    <timeslotAccordion>

    </timeslotAccordion>
  </div>
</template>

<script>
import timeslotAccordion from './timeSlotAccordion.vue'
export default {
  data() {
    return {
      clinics: []
    }
  },
  components: {
    timeslotAccordion
  },
  methods: {
    getClinics() {
      // get clinicss
    },
    handleShowTimeSlots(dentistId) {
      // Hide accordion and display timeslots for dentist._id received
    }
  },
  mounted() {
    this.getClinics()
  }
}
</script>

<style scoped></style>
