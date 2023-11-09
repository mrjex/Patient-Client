import Vue from 'vue'
import Router from 'vue-router'

import Map from './views/Map.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      name: 'Map',
      path: '/map',
      component: Map
    }
  ]
})

export default router
