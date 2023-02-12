import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { usePocketbase } from './pocketbase.service'

export function useSessionService() {
  const pb = usePocketbase()
  const router = useRouter()
  const { dialog, notify } = useQuasar()

  async function logOut() {
    pb.authStore.clear()
    console.debug('Cleared auth token...')
    // TODO i18nize
    notify('You have been logged out.')

    await router.push({
      name: 'login',
    })

    console.log('Successfully finished the logout process.')
  }

  async function promptLogout() {
    // TODO i18nize
    dialog({
      title: 'Log out',
      message: 'Are you sure you want to log out?',
      ok: {
        label: 'Yes, log me out',
        noCaps: true,
      },
      cancel: {
        label: 'No, keep me logged in',
        noCaps: true,
      },
    }).onOk(logOut)
  }

  return {
    logOut,
    promptLogout,
  }
}
