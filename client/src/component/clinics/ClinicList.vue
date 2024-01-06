<template>
  <div class="container text-center ">

    <b-card no-body v-for="clinic in clinics" :key="clinic._id.$oid">
      <b-button variant="info" @click="$emit('clinicClick', clinic)">{{
        clinic.clinic_name }}</b-button>
    </b-card>
  </div>
</template>

<script>
import { getAllClinics } from '@/utility/clinicUtils.js'
export default {
  data() {
    return {
      clinics: [],
      loaded: false,
      displayTimeslots: false
    }
  },
  components: {
  },
  methods: {
    async getClinics() {
      try {
        const res = await getAllClinics()
        this.clinics = res.data.clinics
      } catch (err) {
        console.error(err)
      }
    }
  },
  mounted() {
    this.getClinics()
  }
}
</script>

<style scoped>

</style>
