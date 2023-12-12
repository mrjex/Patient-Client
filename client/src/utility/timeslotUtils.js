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
  try {
    const messageBody = { availableTime_id: availableTimeId }
    const res = await Api.post('appointments/', messageBody)
    if (res.status === 201) {
      return { success: true }
    }
  } catch (err) {
    console.error('Error when creating appointment', err)
    return { success: false }
  }
}
