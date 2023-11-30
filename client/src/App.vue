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
</style>
