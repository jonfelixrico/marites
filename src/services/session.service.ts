import { useRouter } from 'vue-router'
import { usePocketbase } from './pocketbase.service'

export function useSessionService() {
  const pb = usePocketbase()
  const router = useRouter()

  function logOut() {
    pb.authStore.clear()
    console.log('User has logged out. Redirecting to the login page.')
    router.push({
      name: 'login',
    })
  }

  return {
    logOut,
  }
}
