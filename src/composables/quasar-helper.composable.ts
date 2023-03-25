import { QDialogOptions, useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'

interface BasicDialogInput {
  title: string
  message: string
  /**
   * Providing a value will alter the default label on the OK button
   */
  okLabel?: string

  /**
   * Providing a value will add a cancel button with the label.
   */
  cancelLabel?: string
}

interface BasicErrorDialogInput {
  title?: string
  message?: string
  okLabel?: string
}

export function useDialogHelper() {
  const $q = useQuasar()
  const { t } = useI18n()

  function showBasicDialog(
    input: BasicDialogInput,
    otherOpts?: QDialogOptions
  ) {
    return $q.dialog({
      ...otherOpts,

      title: input.title,
      message: input.message,
      ok: input.okLabel
        ? {
            unelevated: true,
            noCaps: true,
            label: input.okLabel,
          }
        : {
            unelevated: true,
            noCaps: true,
          },

      cancel: input.cancelLabel
        ? {
            flat: true,
            noCaps: true,
            label: input.cancelLabel,
            color: 'black',
          }
        : undefined, // no cancelLabel provided = no cancel button at all
    })
  }

  function showBasicErrorDialog(
    input?: BasicErrorDialogInput,
    opts: QDialogOptions = {}
  ) {
    return $q.dialog({
      ...opts,
      title: input?.title ?? t('general.dialog.genericError.title'),
      message: input?.message ?? t('general.dialog.genericError.message'),
      ok: {
        color: 'primary',
        unelevated: true,
        label: input?.okLabel ?? t('general.ok'),
      },
    })
  }

  return {
    showBasicDialog,
    showBasicErrorDialog,
  }
}
