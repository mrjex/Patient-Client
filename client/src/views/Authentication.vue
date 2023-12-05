<template>
<!--
Wireframes:
 Sign uo - https://git.chalmers.se/courses/dit355/2023/student-teams/dit356-2023-20/group-20-distributed-systems/-/wikis/Patient-gui#sign-up
 Sign in - https://git.chalmers.se/courses/dit355/2023/student-teams/dit356-2023-20/group-20-distributed-systems/-/wikis/Patient-gui#sign-in
-->
  <b-container>
    <b-form @submit="onSubmit">
      <b-form-group
        id="username-label"
        label="Username:"
        label-for="username"
      >
        <b-form-input
          id="username"
          v-model="form.username"
          type="username"
          placeholder="Enter Username"
          required
        >
        </b-form-input>
      </b-form-group>

      <b-form-group
        id="password-label"
        label="Password:"
        label-for="password"
      >
        <b-form-input
          id="password"
          v-model="form.password"
          type="password"
          placeholder="Enter password"
          required
        >
        </b-form-input>
      </b-form-group>

      <b-button type="submit" variant="primary">Submit</b-button>

    </b-form>

    <p>{{form.username}}</p>
    <p>{{form.password}}</p>
  </b-container>
</template>

<script>
import { Api } from '@/Api'

export default {
  name: 'Authentication.vue',
  data() {
    return {
      form: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    onSubmit() {
      event.preventDefault()
      console.log(this.form.username)
      console.log(this.form.password)

      const body = {
        email: this.form.username,
        password: this.form.password
      }

      Api.post('/patients/login', body, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          if (response.status === 200) {
            console.log('Yaa')
          }
        })
        .catch(err => {
          if (err.response) {
            if (err.response.status === 404) {
              console.log('Ayy')
            }
          }
          console.log('Ayy no response')
        })

      this.form.username = ''
      this.form.password = ''
    }
  }
}
</script>

<style scoped>

</style>
