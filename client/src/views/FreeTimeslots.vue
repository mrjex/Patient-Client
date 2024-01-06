<template>
    <div class="flex-container">
        <div class="m-2"><h1>Available times</h1></div>
        <timeslotAccordion :dentist_id="'65755b962d80b785642d3869'" :dentistName="'PlaceholderName'" :clinicName="'PlaceHolderClinicName'">

        </timeslotAccordion>
    </div>
</template>
<!--This view is hardcoded for testing purposes and is not meant to be its own view in production-->
<script>
import timeslotAccordion from '../component/timeslots/timeslotAccordion.vue'
export default {
  name: 'FreeTimeslotsView',
  components: {
    timeslotAccordion
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
