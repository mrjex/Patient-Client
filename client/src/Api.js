import axios from 'axios'

export const Api = axios.create({
  baseURL: process.env.VUE_APP_API_ENDPOINT || 'http://localhost:3000'
})

Api.interceptors.response.use(async function (response) {
  return response
}, async function (error) {
  if (error.response && error.response.status === 401) {
    delete Api.defaults.headers.common.authorization
    localStorage.removeItem('token')
    window.location = '/authentication'
  }
  return Promise.reject(error)
})
