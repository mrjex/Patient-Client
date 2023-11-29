import Vue from 'vue'
import Router from 'vue-router'

import MapPage from './views/MapPage.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      name: 'MapPage',
      path: '/map',
      component: MapPage
    }
  ]
})

export default router
