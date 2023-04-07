<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card>
      <q-card-section class="text-h6 q-pb-none">
        {{ $t('chat.toolbar.dialog.showJoinCode.title') }}
      </q-card-section>

      <q-card-section>
        <i18n-t
          keypath="chat.toolbar.dialog.showJoinCode.message"
          tag="div"
          class="row items-center pre-wrap"
        >
          <template #joinCode>
            <ClickToCopyBtn :content="joinCode" @copy="showCopyNotif" />
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
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import ClickToCopyBtn from 'components/ClickToCopyBtn.vue'

export default defineComponent({
  components: { ClickToCopyBtn },

  props: {
    joinCode: {
      type: String,
      required: true,
    },
  },

  emits: [...useDialogPluginComponent.emits],

  setup() {
    const { notify } = useQuasar()
    const { t } = useI18n()
    const pluginComp = useDialogPluginComponent()

    async function showCopyNotif() {
      notify(t('chat.toolbar.notif.joinCodeCopied'))
      pluginComp.onDialogOK()
    }

    return {
      showCopyNotif,
      ...pluginComp,
    }
  },
})
</script>
