<template>
  <q-item clickable @click="showDialog">
    <q-item-section>
      {{ $t('chat.toolbar.showJoinCode') }}
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { useQuasar } from 'quasar'
import { useDialogHelper } from 'src/composables/dialog-helper.composable'
import { useChatIdFromRoute } from 'src/composables/route-chat-id.composable'
import { useChatStore } from 'src/stores/chat.store'
import { defineComponent, computed } from 'vue'
import ChatToolbarMenuItemShowJoinCodeDialog from './ChatToolbarMenuItemShowJoinCodeDialog.vue'
import { useI18n } from 'vue-i18n'
import { useChatJoinCodeAPI } from 'src/composables/chat-join-code-api.composable'

export default defineComponent({
  setup() {
    const chatId = useChatIdFromRoute()
    const store = useChatStore()
    const chat = computed(() => store.chats[chatId.value])

    const { dialog, loading } = useQuasar()
    const { showBasicDialog } = useDialogHelper()
    const { t } = useI18n()
    const { getJoinCode } = useChatJoinCodeAPI()

    async function showDialog() {
      loading.show()
      try {
        dialog({
          component: ChatToolbarMenuItemShowJoinCodeDialog,
          componentProps: {
            joinCode: await getJoinCode(chatId.value),
          },
        })
      } catch (e) {
        console.error(e)
        // TODO maybe make a util for generic errors
        showBasicDialog({
          title: t('general.dialog.genericError.title'),
          message: t('general.dialog.genericError.message'),
        })
      } finally {
        loading.hide()
      }
    }

    return {
      chat,
      showDialog,
    }
  },
})
</script>
