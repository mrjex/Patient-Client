<template>
  <div id="app">
    <div id="nav">
      <DentaNoidHeader/>
    </div>
    <!-- Your application content -->
    <router-view/>
  </div>
</template>
<script>

import DentaNoidHeader from './component/DentaNoidHeader.vue'
export default {
  name: 'app',
  components: { DentaNoidHeader }
}
</script>

<style>
</style>
