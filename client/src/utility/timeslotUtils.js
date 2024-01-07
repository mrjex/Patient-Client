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
    if (res.status === 200 || res.status === 201) {
      return { success: true }
    }
  } catch (err) {
    console.error('Error when creating appointment', err)
    return { success: false }
  }
}

export async function getTimeWindowTimeSlots(clinics, timeSlot) {
  try {
    const clinicsString = clinics.join(',')
    const params = { clinics: clinicsString, start_time: timeSlot.startDate, end_time: timeSlot.endDate }
    const res = await Api.get('availabletimes/clinics', { params })
    if (res.status === 200) {
      return res
    }
  } catch (err) {
    console.error('Error when getting timeslots', err)
  }
}
