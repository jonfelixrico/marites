<template>
  <q-item clickable @click="showDialog" v-if="shouldRender">
    <q-item-section>
      {{ $t('chat.toolbar.resetJoinCode') }}
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { useChatJoinCodeAPI } from 'src/composables/chat-join-code-api.composable'
import { useDialogHelper } from 'src/composables/quasar-helper.composable'
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
    const { showBasicDialog } = useDialogHelper()
    const { t } = useI18n()

    function showDialog() {
      showBasicDialog({
        title: t('chat.toolbar.dialog.resetJoinCodePrompt.title'),
        message: t('chat.toolbar.dialog.resetJoinCodePrompt.message'),
        okLabel: t('general.yes'),
        cancelLabel: t('general.cancel'),
      }).onOk(async () => {
        // TODO add error handling
        const newJoinCode = await resetJoinCode(chatId.value)

        showBasicDialog({
          title: t('chat.toolbar.dialog.resetJoinCodeSuccess.title'),
          // TODO create custom dialog so that we can copy the functionality of ShowJoinCodeDialog
          message: t('chat.toolbar.dialog.resetJoinCodeSuccess.message', {
            joinCode: newJoinCode,
          }),
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
