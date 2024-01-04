<template>
  <div id="app">
    <div id="nav">
      <DentaNoidHeader/>
    </div>
    <!-- Your application content -->
    <router-view/>
    <DentanoidFooter/>
  </div>
</template>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
}
</style>

<script>

import DentaNoidHeader from './component/DentaNoidHeader.vue'
import DentanoidFooter from './component/DentanoidFooter.vue'
export default {
  name: 'app',
  components: { DentanoidFooter, DentaNoidHeader }
}
</script>

<style>
body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.custom-rounded-card {
  border-radius: 7px !important;
  border: blue;
  overflow: hidden;
}

</style>
