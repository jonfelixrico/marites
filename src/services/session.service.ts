import { useRouter } from 'vue-router'
import { usePocketbase } from './pocketbase.service'

export function useSessionService() {
  const pb = usePocketbase()
  const router = useRouter()

  async function logOut() {
    pb.authStore.clear()
    console.debug('Cleared auth token...')

    await router.push({
      name: 'login',
    })

    console.log('Successfully finished the logout process.')
  }

  return {
    logOut,
  }
}
