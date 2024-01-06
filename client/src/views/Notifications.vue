<template>
<!-- Wireframe - https://git.chalmers.se/courses/dit355/2023/student-teams/dit356-2023-20/group-20-distributed-systems/-/wikis/Patient-gui#notifications -->
  <body>
  <div class="container text-center list">
    <email-subscription :clinics="clinics"/>
  </div>
  </body>
</template>

<script>
import EmailSubscription from '@/component/EmailSubscription.vue'

export default {
  name: 'Notifications.vue',
  components: { EmailSubscription },
  data() {
    return {
      clinics: [{ name: 'clinic  klubb', clinicID: '1234' }, { name: 'clinic  klubb', clinicID: '1234' }, { name: 'clinic  klubb', clinicID: '1234' }, { name: 'clinic  klubb', clinicID: '1234' }, { name: 'clinic  klubb', clinicID: '1234' }, { name: 'clinic  klubb', clinicID: '1234' }, { name: 'clinic  klubb', clinicID: '1234' }, { name: 'fobarnamns klubb 2', clinicID: '5678' }, { name: 'clinic fobarnamns', clinicID: '9101' }]
    }
  }
}
</script>

<style scoped>
.list {
  width: fit-content;
}
</style>
