<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="dialog-width">
      <q-card-section class="q-pb-none text-h6">
        {{ t('mainMenu.dialog.userCodeShow.title') }}
      </q-card-section>

      <q-card-section>
        <i18n-t keypath="mainMenu.dialog.userCodeShow.message">
          <!-- TODO use the copy button -->
          <template #userCode>
            <ClickToCopyBtn
              :content="userCode"
              :copy-notif="t('mainMenu.dialog.userCodeShow.copyNotif')"
            />
          </template>
        </i18n-t>
      </q-card-section>

      <q-card-actions align="between">
        <q-btn no-caps flat color="negative" @click="handleResetClick">
          {{ t('mainMenu.dialog.userCodeShow.reset') }}
        </q-btn>
        <q-btn no-caps unelevated color="primary" v-close-popup autofocus>
          {{ t('general.close') }}
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import ClickToCopyBtn from 'components/ClickToCopyBtn.vue'
import { useDialogHelper } from 'src/composables/quasar-helper.composable'
import { useUserCodeAPI } from 'src/composables/user-api.composable'
import { useSessionApi } from 'src/composables/session-api.composable'
import UserCodeResetSuccessDialog from './UserCodeResetSuccessDialog.vue'

function useResetUserCode() {
  const { t } = useI18n()
  const { showBasicDialog, showBasicErrorDialog } = useDialogHelper()
  const { resetUserCode } = useUserCodeAPI()
  const { getSessionUser } = useSessionApi()
  const { loading, dialog } = useQuasar()

  function showPrompt() {
    return new Promise<boolean>((resolve) => {
      showBasicDialog({
        title: t('mainMenu.dialog.userCodeResetConfirm.title'),
        message: t('mainMenu.dialog.userCodeResetConfirm.message'),
        okLabel: t('mainMenu.dialog.userCodeResetConfirm.ok'),
        cancelLabel: t('mainMenu.dialog.userCodeResetConfirm.cancel'),
      })
        .onOk(() => resolve(true))
        .onCancel(() => resolve(false))
    })
  }

  function showSuccessDialog(userCode: string) {
    dialog({
      component: UserCodeResetSuccessDialog,
      componentProps: {
        userCode,
      },
    })
  }

  async function resetCode() {
    const didUserConfirm = await showPrompt()
    if (!didUserConfirm) {
      return
    }

    try {
      loading.show()
      const newUserCode = await resetUserCode(getSessionUser().id)
      showSuccessDialog(newUserCode)
    } catch (e) {
      showBasicErrorDialog()
    } finally {
      loading.hide()
    }
  }

  return {
    resetCode,
  }
}

export default defineComponent({
  components: { ClickToCopyBtn },

  emits: [...useDialogPluginComponent.emits],
  props: {
    userCode: {
      type: String,
      required: true,
    },
  },
  setup() {
    const pluginComp = useDialogPluginComponent()
    const { t } = useI18n()
    const { resetCode } = useResetUserCode()

    function handleResetClick() {
      pluginComp.onDialogHide()
      resetCode()
    }

    return {
      ...pluginComp,
      t,
      handleResetClick,
    }
  },
})
</script>
