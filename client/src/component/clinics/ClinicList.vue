<template>
  <div class="container text-center ">

    <b-card no-body v-for="clinic in clinics" :key="clinic._id.$oid">
      <b-button variant="light" @click="$emit('clinicClick', clinic)">{{
        clinic.clinic_name }}</b-button>
    </b-card>
  </div>
</template>

<script>
export default {
  props: {
    clinics: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      loaded: false,
      displayTimeslots: false
    }
  }
}
</script>

<style scoped>
</style>
