<template>
  <div class="sub-list text-center">
    <b-list-group>
      <b-list-group-item v-for="(clinic, index) in clinics" :key="index">

        <div class="clinic-select">
          <h3>{{ clinic.name }}</h3>
          <p style="font-size: 10px; color: gray">Clinic id: {{ clinic.clinicID}}</p>
          <b-btn v-if="!subList.includes(clinic.clinicID)" pill variant="outline-success" @click="subslist(clinic)">Subscribe</b-btn>
          <b-btn v-if="subList.includes(clinic.clinicID)" pill variant="outline-danger" @click="subslist(clinic)">Unsubscribe</b-btn>
        </div>

      </b-list-group-item>
    </b-list-group>
    <p>Subscribe to: {{ subList }}</p>
    <b-btn v-if="subList.length > 0" pill variant="outline-success" @click="notificationSubscribe()">Confirm</b-btn>
  </div>
</template>

<script>
import { Api } from '@/Api'

export default {
  name: 'emailSubscription.vue',
  data() {
    return {
      subList: []
    }
  },
  props: {
    clinics: {
      required: true
    }
  },
  methods: {
    subslist(clinic) {
      if (!this.subList.includes(clinic.clinicID)) {
        this.subList.push(clinic.clinicID)
      } else {
        const clinicIndex = this.subList.indexOf(clinic.clinicID)
        this.subList.splice(clinicIndex, 1)
      }
    },
    notificationSubscribe() {
      const subscriber = {
        patient_ID: '123',
        email: 'en@mail.com',
        clinicID: this.subList
      }
      console.log(subscriber)
      Api.post('http://localhost:3000/subscriber/', subscriber).then(response => {
        if (response.status === 201) { console.log('succes') }
      }).catch(error => {
        console.error(error)
      })
    }
  }
}
</script>

<style scoped>
.sub-list {
  width: auto;
  height: auto;
}
.clinic-select {
  background-color: white;
  border-color: #007BFF;
  border-style: solid;
  border-radius: 2vw;
  color: #007BFF;
  transition: all .5s ease-in-out;
  margin: 15px;
  box-shadow: 0 20px 14px 0 rgba(0, 0, 0, 0.5), 0 6px 20px 0 rgba(0, 0, 0, 0.19); /* Adds depth Credit: www.w3schools.com/css/css3_shadows_box.asp */
  animation: fadeInAnimation ease 3s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}

@keyframes fadeInAnimation {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.clinic-select:hover { transform: scale(1.05); }

* {
  /*border-style: dashed;*/
  /*border-color: green;*/
  /*border-radius: 5vw;*/
  padding: 3px;
  font-family: Verdana;
}
</style>
