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

export async function bookAppointment(availableTimeId) {
  try {
    const messageBody = { availableTime_id: availableTimeId }
    const res = await Api.post('appointments/', messageBody)
    return res
  } catch (err) {
    console.error('Error when creating appointment', err)
  }
}
