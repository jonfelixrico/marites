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
import { PBChatJoinCode } from 'src/models/pb-chat-join-code.interface'
import { PBCollection } from 'src/models/pb-collection.enum'
import { usePocketbase } from 'src/services/pocketbase.service'
import { useChatStore } from 'src/stores/chat.store'
import { wrapString } from 'src/utils/pocketbase.util'
import { defineComponent, computed } from 'vue'
import ChatToolbarMenuItemShowJoinCodeDialog from './ChatToolbarMenuItemShowJoinCodeDialog.vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  setup() {
    const chatId = useChatIdFromRoute()
    const store = useChatStore()
    const chat = computed(() => store.chats[chatId.value])

    const { dialog, loading } = useQuasar()
    const { showBasicDialog } = useDialogHelper()
    const pb = usePocketbase()
    const { t } = useI18n()

    async function showDialog() {
      loading.show()
      try {
        // TODO move to chat api
        const { joinCode } = await pb
          .collection(PBCollection.CHAT_JOIN_CODE)
          .getFirstListItem<PBChatJoinCode>(
            `chat = ${wrapString(chatId.value)}`
          )

        dialog({
          component: ChatToolbarMenuItemShowJoinCodeDialog,
          componentProps: {
            joinCode,
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
