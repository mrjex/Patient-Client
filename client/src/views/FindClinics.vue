<template>
  <body>
    <div class="flex-container">
      <div class="m-2">
        <h1>Find a Clinic</h1>
      </div>
      <div class="container-fluid">
        <!--clinic list component-->
        <clinicList v-if="displayClinics" @clinicClick="handleClinicClick"></clinicList>

        <!--dentist list component-->
        <div >
          <dentistList :employees="employees"
            @dentistClick="handleDentistClick" v-if="displayDentists" @showClinics="handleDisplayClinics">
          </dentistList>
        </div>

        <!--timeslot list component-->
        <div>
          <timeslotAccordion v-if="displayTimeslots" :dentist="dentist" @showDentists="handleDisplayDentists">
          </timeslotAccordion>
        </div>

      </div>
    </div>
  </body>
</template>

<script>
import clinicList from '../component/clinics/ClinicList.vue'
import dentistList from '../component/clinics/dentistList.vue'
import timeslotAccordion from '../component/timeslots/timeslotAccordion.vue'

export default {
  name: 'ClinicsView',
  components: {
    clinicList,
    dentistList,
    timeslotAccordion
  },
  data() {
    return {
      employees: [],
      dentist: null,
      displayDentists: false,
      displayClinics: true,
      displayTimeslots: false,
      resetText: 'Show Clinics'
    }
  },
  methods: {
    handleClinicClick(clinic) {
      this.displayClinics = false
      this.displayDentists = true
      this.employees = clinic.employees
    },
    handleDentistClick(dentist) {
      this.displayClinics = false
      this.displayDentists = false
      this.displayTimeslots = true
      this.dentist = dentist
    },
    handleDisplayClinics() {
      this.displayClinics = true
      this.displayDentists = false
      this.displayTimeslots = false
    },
    handleDisplayDentists() {
      this.displayClinics = false
      this.displayDentists = true
      this.displayTimeslots = false
    }
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

</style>
