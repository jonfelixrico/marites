<template>
  <q-item clickable @click="showDialog" v-if="shouldRender">
    <q-item-section>
      {{ $t('chat.toolbar.resetJoinCode') }}
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { useChatJoinCodeAPI } from 'src/composables/chat-join-code-api.composable'
import { useDialogHelper } from 'src/composables/dialog-helper.composable'
import { useChatIdFromRoute } from 'src/composables/route-chat-id.composable'
import { useSessionApi } from 'src/composables/session-api.composable'
import { useChatStore } from 'src/stores/chat.store'
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

    const { resetJoinCode } = useChatJoinCodeAPI()
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
          await resetJoinCode(chatId.value)
        })
    }

    return {
      shouldRender,
      showDialog,
    }
  },
})
</script>
