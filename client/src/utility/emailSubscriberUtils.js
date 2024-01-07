import { Api } from '@/Api'

export async function postSubscriber(subscriber) {
  try {
    const res = await Api.post('subscriber/', subscriber)
    if (res.data.status === 201) {
      console.log('Sub created')
      return true
    }
    return false
  } catch (err) {
    console.error('Error when posting subscriber', err)
  }
}
