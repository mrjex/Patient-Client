<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="primary" id="main-header" style="font-size: 1.3rem;">
      <b-navbar-brand href="/">
        DentaNoid
<!--TODO: Insert logo        <img src="">-->
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item href="/clinics">Clinics</b-nav-item>
          <b-nav-item href="/aboutus">About us</b-nav-item>
          <b-nav-item v-if="isLoggedIn" href="/mybookings">My bookings</b-nav-item>
          <b-nav-item v-if="isLoggedIn" href="/notifications">Notifications</b-nav-item>

        </b-navbar-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item v-if="!isLoggedIn" @click="signInSignOut()">Login</b-nav-item>
          <b-nav-item v-if="!isLoggedIn" @click="signInSignOut()">Sign Up</b-nav-item>
          <b-nav-item v-if="isLoggedIn" @click="signInSignOut()">Sign out</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
export default {
  name: 'Header.vue',
  data() {
    return {
      isLoggedIn: false
    }
  },
  methods: {
    signInSignOut() {
      if (!this.isLoggedIn) {
        this.isLoggedIn = true
        localStorage.setItem('isLoggedIn', true)
      } else {
        this.isLoggedIn = false
        localStorage.setItem('isLoggedIn', false)
      }
    }
  },
  created() {
    this.isLoggedIn = localStorage.getItem('isLoggedIn')
  }
}
</script>

<style scoped>

</style>
