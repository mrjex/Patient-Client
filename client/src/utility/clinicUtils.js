import { Api } from '../Api'

export async function getClinic(clinicId) {
  try {
    const res = await Api.get('clinics/' + clinicId)
    if (res.status === 200) {
      return res
    }
  } catch (err) {
    console.error('Error when getting clinics', err)
  }
}

export async function getAllClinics() {
  try {
    const res = await Api.get('clinics/')
    if (res.status === 200) {
      return res
    }
  } catch (err) {
    console.error('Error when getting clinics', err)
  }
}
