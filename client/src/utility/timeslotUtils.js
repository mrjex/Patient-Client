import { Api } from '../Api'

export async function getFreeTimeslots(dentistId) {
  try {
    const res = await Api.get('availabletimes/dentists/' + dentistId)
    if (res.status === 200) {
      return res
    }
  } catch (err) {
    console.error('Error when getting timeslots', err)
  }
}
/* This function currently uses a hardcoded token for testing purposes
remove it once token is attached on every request by default */
export async function bookAppointment(availableTimeId) {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXRpZW50X2lkIjoiNjU3NWQyOWM1ZjkxMGY1NWZiMmMxNzU4IiwiaWF0IjoxNzAyMzc3MTgxLCJleHAiOjE3MDIzNzg5ODF9.VApbPTjF8rIuWldeedmiCVPrn5ii_EUPTAezm4zHGxg'
  try {
    const messageBody = { availableTime_id: availableTimeId }
    const res = await Api.post('appointments/', messageBody, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return res
  } catch (err) {
    console.error('Error when creating appointment', err)
  }
}
