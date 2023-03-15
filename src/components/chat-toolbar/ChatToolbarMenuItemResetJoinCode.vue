<template>
  <q-item clickable @click="showDialog" v-if="shouldRender">
    <q-item-section>
      {{ $t('chat.toolbar.resetJoinCode') }}
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { nanoid } from 'nanoid'
import { useDialogHelper } from 'src/composables/dialog-helper.composable'
import { useChatIdFromRoute } from 'src/composables/route-chat-id.composable'
import { useSessionApi } from 'src/composables/session-api.composable'
import { PBChatJoinCode } from 'src/models/pb-chat-join-code.interface'
import { PBCollection } from 'src/models/pb-collection.enum'
import { usePocketbase } from 'src/services/pocketbase.service'
import { useChatStore } from 'src/stores/chat.store'
import { wrapString } from 'src/utils/pocketbase.util'
import { defineComponent, computed } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  setup() {
    const { getSessionUser } = useSessionApi()
    const chatId = useChatIdFromRoute()
    const store = useChatStore()
    const shouldRender = computed(() => {
      const chat = store.chats[chatId.value]
      const sessionUserId = getSessionUser().id

      return !!chat.members.find(({ id }) => id === sessionUserId)?.isOwner
    })

    const pb = usePocketbase()

    const dialogHelper = useDialogHelper()
    const { t } = useI18n()

    function showDialog() {
      dialogHelper
        .showBasicDialog({
          title: t('chat.toolbar.dialog.resetJoinCodePrompt.title'),
          message: t('chat.toolbar.dialog.resetJoinCodePrompt.message'),
          okLabel: t('general.yes'),
          cancelLabel: t('general.cancel'),
        })
        .onOk(async () => {
          // TODO move these to chat API

          const collection = await pb.collection(PBCollection.CHAT_JOIN_CODE)

          const { id } = await collection.getFirstListItem(
            `chat = ${wrapString(chatId.value)}`
          )
          await pb
            .collection(PBCollection.CHAT_JOIN_CODE)
            .update<PBChatJoinCode>(id, {
              chat: chatId.value,
              joinCode: nanoid(),
            })
        })
    }

    return {
      shouldRender,
      showDialog,
    }
  },
})
</script>
