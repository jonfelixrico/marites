<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card>
      <q-card-section class="text-h6 q-pb-none">
        {{ $t('chat.toolbar.dialog.showJoinCode.title') }}
      </q-card-section>

      <q-card-section>
        <i18n-t keypath="chat.toolbar.dialog.showJoinCode.message" tag="div">
          <template #joinCode>
            <q-btn dense no-caps unelevated @click="copyCode" v-close-popup>
              <div class="q-gutter-x-xs">
                <span>{{ joinCode }}</span>
                <q-icon
                  class="text-weight-bold"
                  name="content_copy"
                  size="xs"
                />
              </div>
            </q-btn>
          </template>
        </i18n-t>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn color="primary" no-caps unelevated v-close-popup>{{
          $t('general.ok')
        }}</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { copyToClipboard, useDialogPluginComponent, useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  props: {
    joinCode: {
      type: String,
      required: true,
    },
  },

  emits: [...useDialogPluginComponent.emits],

  setup(props) {
    const { notify } = useQuasar()
    const { t } = useI18n()

    async function copyCode() {
      await copyToClipboard(props.joinCode)
      notify(t('chat.toolbar.notif.joinCodeCopied'))
    }

    return {
      copyCode,
      ...useDialogPluginComponent(),
    }
  },
})
</script>
