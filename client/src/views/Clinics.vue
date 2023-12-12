<template>
  <div class="flex-container">
    <div class="m-2">
      <h1>Clinics</h1>
    </div>
    <div class="container-fluid">
      <clinicList></clinicList>
    </div>
  </div>
</template>
<!--This view is hardcoded for testing purposes and is not meant to be its own view in production-->
<script>
import clinicList from '../component/clinics/ClinicList.vue'
export default {
  name: 'ClinicsView',
  components: {
    clinicList
  }
}
</script>

<style scoped>
.flex-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  flex-direction: column;
}
</style>
