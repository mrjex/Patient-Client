<template>
    <div>
       <div>
          <b-container id="myPanel">
            <div>
              <b-form-rating inline value="3.5" readonly variant="warning"></b-form-rating>

              <!-- <b-form-rating inline v-bind:value="valueA" readonly variant="warning"></b-form-rating> -->
              <b-form-rating inline v-bind:value="ratingValue" readonly variant="warning"></b-form-rating>
              <b-form-rating v-model="valueA" variant="warning" class="mb-2"></b-form-rating>
            </div>
            <h4>Rating is {{ ratingValue }}</h4>
            <h4>testG: {{ testG }}</h4>
          </b-container>
       </div>
    </div>
</template>
<script>

import { clinicStatisticsMap } from '../../public/maps/map-utils.js'

export default {
  name: 'InfoWindowComponent',
  data() {
    return {
      valueA: 5,
      total_user_ratings: 69
    }
  },
  created() {
    console.log('created()')
    localStorage.setItem('testG', '0')
  },
  methods: {
    myMethod() {
      // console.warn('myMethod')
      this.valueA = clinicStatisticsMap.get('ratings')
      return this.valueA
    }
  },
  computed: {
    ratingValue: function () {
      // console.warn('getRatingValue')
      return this.myMethod()
    },
    testG: function () {
      let value = localStorage.getItem('testG')
      value++
      localStorage.setItem('testG', value)
      return value
    }
  }
}
</script>

<style scoped>
#myPanel {
    background-color:rgb(207, 207, 207);
    height: 20vh;
    width: 30vw;
    border-radius: 0.5vw;
    z-index: -1;
}
</style>
