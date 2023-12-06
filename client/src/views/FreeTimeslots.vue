<template>
    <div class="flex-container">
        <div class="m-2"><h1>Available times</h1></div>
        <timeslotAccordion>

        </timeslotAccordion>
    </div>
</template>

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
