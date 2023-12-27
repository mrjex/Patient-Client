<template>
    <div>
        <!--
       <div>
        <h4>Info window component!</h4>
        <b-form-rating v-model="value" variant="warning" class="mb-2"></b-form-rating>
       </div>

       <div>
        <label for="rating-inline">Inline rating:</label>
        <b-form-rating id="rating-inline" inline value="4" variant="warning" disabled></b-form-rating>
       </div>

        <div>
          <b-container class="fluid full-height" id="myPanel"></b-container>
       </div>
       -->

       <div>
        <!-- <label for="rating-inline"></label>
        <b-form-rating id="rating-inline" inline value="3.5" variant="warning"></b-form-rating>
        -->
        <b-form-rating inline value="3.5" variant="warning"></b-form-rating>
       </div>
    </div>
</template>

<script>

export default {
  name: 'InfoWindowComponent',
  data() {
    return {
      value: 4.6
    }
  },
  created() {
  },
  methods: {
  }
}
</script>

<style scoped>
#myPanel {
    background-color:rgb(88, 136, 120);
    height: 50vh;
    width: 30vw;
    border-radius: 2vw;
}
</style>
