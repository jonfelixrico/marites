<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card>
      <q-card-section class="q-pb-none">
        {{ t('mainMenu.dialog.userCodeShow.title') }}
      </q-card-section>

      <q-card-section>
        <i18n-t keypath="mainMenu.dialog.userCodeShow.message">
          <!-- TODO use the copy button -->
          <template #userCode>{{ userCode }}</template>
        </i18n-t>
      </q-card-section>

      <q-card-actions align="between">
        <q-btn no-caps flat color="danger">
          {{ t('mainMenu.dialog.userCodeShow.reset') }}
        </q-btn>
        <!-- TODO add autofocus if applicable -->
        <q-btn no-caps unelevated color="primary">
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

export default defineComponent({
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
