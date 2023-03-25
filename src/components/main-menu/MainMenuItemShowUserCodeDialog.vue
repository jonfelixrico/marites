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
        <q-btn no-caps flat color="negative">
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
import { useDialogPluginComponent } from 'quasar'
import { useI18n } from 'vue-i18n'
import ClickToCopyBtn from 'components/ClickToCopyBtn.vue'

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

    return {
      ...pluginComp,
      t,
    }
  },
})
</script>
