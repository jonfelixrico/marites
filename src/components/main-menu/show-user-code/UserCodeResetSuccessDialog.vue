<!-- This snippet below is a template for creating dialog plugin components -->

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="dialog-width">
      <q-card-section class="q-pb-none text-h6">
        {{ t('mainMenu.dialog.userCodeResetSuccess.title') }}
      </q-card-section>

      <q-card-section>
        <i18n-t keypath="mainMenu.dialog.userCodeResetSuccess.message">
          <template #userCode>
            <ClickToCopyBtn
              :content="userCode"
              :copy-notif="t('mainMenu.dialog.userCodeResetSuccess.copyNotif')"
            />
          </template>
        </i18n-t>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn no-caps primary unelevated v-close-popup color="primary">
          {{ t('general.ok') }}
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useDialogPluginComponent } from 'quasar'
import { useI18n } from 'vue-i18n'
import ClickToCopyBtn from 'src/components/ClickToCopyBtn.vue'

export default defineComponent({
  emits: [...useDialogPluginComponent.emits],

  props: {
    userCode: {
      required: true,
      type: String,
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

  components: { ClickToCopyBtn },
})
</script>
