<template>
  <!-- Wireframe - https://git.chalmers.se/courses/dit355/2023/student-teams/dit356-2023-20/group-20-distributed-systems/-/wikis/Patient-gui#notifications -->
  <body>
  <div class="container text-center list">
    <email-subscription :clinics="clinics" :user="user"/>
  </div>
  </body>
</template>

<script>
import EmailSubscription from '@/component/EmailSubscription.vue'
import { getAllClinics } from '@/utility/clinicUtils'
import { getPatient } from '@/utility/patientUtils'

export default {
  name: 'Notifications.vue',
  components: {EmailSubscription},
  data() {
    return {
      clinics: [],
      user: ''
    }
  },
  methods: {
    async getClinics() {
      try {
        const res = await getAllClinics()
        console.log(res)
        this.clinics = res.data.clinics
      } catch (err) {
        console.error(err)
      }
    }
  },
  async mounted() {
    await this.getClinics()
    this.user = await getPatient()
    console.log(this.user)
  }
}
</script>

<style scoped>
.list {
  width: fit-content;
}
</style>
