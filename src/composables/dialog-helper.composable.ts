import { QDialogOptions, useQuasar } from 'quasar'

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

export function useDialogHelper() {
  const $q = useQuasar()

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
          }
        : undefined, // no cancelLabel provided = no cancel button at all
    })
  }

  return {
    showBasicDialog,
  }
}
