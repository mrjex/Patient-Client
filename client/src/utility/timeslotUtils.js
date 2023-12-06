import { Api } from '../Api'

export async function getFreeTimeslots(dentistID) {
  try {
    const res = await Api.get('timeslots/dentists/' + dentistID)
    if (res.status === 200) {
      return res
    }
  } catch (err) {
    console.error('Error when getting timeslots', err)
  }
}
