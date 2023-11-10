import Vue from 'vue'
import Router from 'vue-router'

import Map from './views/Map.vue'
import MapNearbyLocations from './views/MapNearbyLocations.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      name: 'MapPage',
      path: '/map',
      component: Map
    },
    {
      name: 'TestPage',
      path: '/test',
      component: MapNearbyLocations
    }
  ]
})

export default router
