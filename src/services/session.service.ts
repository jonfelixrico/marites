import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { usePocketbase } from './pocketbase.service'

export function useSessionService() {
  const pb = usePocketbase()
  const router = useRouter()
  const { dialog, notify } = useQuasar()
  const { t } = useI18n()

  async function logOut() {
    pb.authStore.clear()
    console.debug('Cleared auth token...')
    notify(t('session.logOutSuccessNotif'))

    await router.push({
      name: 'login',
    })

    console.log('Successfully finished the logout process.')
  }

  async function promptLogOut() {
    dialog({
      title: t('session.logOutPrompt.title'),
      message: t('session.logOutPrompt.message'),
      focus: 'cancel',
      ok: {
        label: t('session.logOutPrompt.okLabel'),
        noCaps: true,
        unelevated: true,
      },
      cancel: {
        label: t('session.logOutPrompt.cancelLabel'),
        noCaps: true,
        flat: true,
      },
    }).onOk(logOut)
  }

  return {
    logOut,
    promptLogOut,
  }
}
