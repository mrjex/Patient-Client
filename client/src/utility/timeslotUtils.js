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
