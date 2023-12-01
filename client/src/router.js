import Vue from 'vue'
import Router from 'vue-router'
import LandingPage from '@/views/LandingPage.vue'
import aboutUs from '@/views/AboutUs.vue'
import authentication from '@/views/Authentication.vue'
import clinicSignUp from '@/views/ClinicSignUp.vue'
import myBookings from '@/views/MyBookings.vue'
import Notifications from '@/views/Notifications.vue'
import FindClinics from '@/views/FindClinics.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'landingPage',
      component: LandingPage
    },
    {
      path: '/aboutus',
      name: 'aboutUsView',
      component: aboutUs
    },
    {
      path: '/clinics',
      name: 'FindClinics',
      component: FindClinics
    },
    {
      path: '/authentication',
      name: 'authenticationView',
      component: authentication
    },
    {
      path: '/clinicsignup',
      name: 'clinicSignUpView',
      component: clinicSignUp
    },
    {
      path: '/mybookings',
      name: 'myBookingsView',
      component: myBookings
    },
    {
      path: '/notifications',
      name: 'notificationsView',
      component: Notifications
    }
  ]
})
