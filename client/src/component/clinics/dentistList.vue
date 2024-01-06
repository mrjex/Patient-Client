<template>
  <div class="container-fluid">
    <b-card no-body>
      <b-button variant="info" @click="$emit('showClinics')">
        {{ resetText }}
      </b-button>
    </b-card>
    <b-card no-body v-for="dentist in dentists" :key="dentist._id">
      <b-button variant="info" @click="$emit('dentistClick', dentist)">{{
        dentist.username }}</b-button>
    </b-card>
    <div v-if="dentists.length === 0">This clinic has no employees</div>
  </div>
</template>

<script>
import { getDentist } from '@/utility/dentistUtils.js'
export default {
  name: 'dentistList',
  props: {
    employees: {
      required: true
    }
  },
  data() {
    return {
      dentists: [],
      resetText: 'Back to Clinics..'
    }
  },
  methods: {
    handleDentistClick(dentist) {
      this.$emit('showTimeslots', dentist._id)
    },
    async getDentists() {
      try {
        this.employees.forEach(async (employee) => {
          const res = await getDentist(employee.dentist_id)
          if (res) {
            this.dentists.push(res.data.dentist)
          }
        })
      } catch (err) {
        console.error(err)
      }
    }
  },
  mounted() {
    this.getDentists()
  }
}
</script>

<style scoped></style>
