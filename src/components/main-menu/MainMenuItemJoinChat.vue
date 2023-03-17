<template>
  <q-item clickable @click="openJoinChatDialog">
    <q-item-section>
      {{ $t('mainMenu.joinChat') }}
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { useQuasar } from 'quasar'
import { useChatFetchAPI } from 'src/composables/chat-api.composable'
import { useChatMembershipAPI } from 'src/composables/chat-membership-api.composable'
import { useDialogHelper } from 'src/composables/dialog-helper.composable'
import { defineComponent } from 'vue'
import MainMenuItemJoinChatDialog from './MainMenuItemJoinChatDialog.vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

export default defineComponent({
  setup() {
    const { dialog, loading, notify } = useQuasar()
    const { showBasicDialog, showBasicErrorDialog } = useDialogHelper()
    const { joinChat } = useChatMembershipAPI()
    const { getChatName } = useChatFetchAPI()
    const { t } = useI18n()
    const router = useRouter()

    async function joinUserToChat(chatId: string, chatName: string) {
      try {
        loading.show()

        await joinChat({
          chatId,
        })
        notify(t('mainMenu.notif.joinChatSuccess', { chatName }))
        router.push({
          name: 'chat',
          params: {
            chatId,
          },
        })
      } catch (e) {
        console.error(e, 'Error encountered while joining')
        showBasicErrorDialog()
      } finally {
        loading.hide()
      }
    }

    async function confirmIfUserWantsToJoin(chatId: string) {
      let chatName: string
      try {
        loading.show()
        chatName = await getChatName(chatId)
      } finally {
        loading.hide()
      }

      showBasicDialog({
        title: t('mainMenu.dialog.joinChatConfirm.title'),
        message: t('mainMenu.dialog.joinChatConfirm.message', { chatName }),
        okLabel: t('mainMenu.dialog.joinChatConfirm.ok'),
        cancelLabel: t('general.no'),
      }).onOk(() => joinUserToChat(chatId, chatName))
    }

    function openJoinChatDialog() {
      dialog({
        component: MainMenuItemJoinChatDialog,
      }).onOk(confirmIfUserWantsToJoin) // onOk will only happen if the code has passed validation in the dialog
    }

    return {
      openJoinChatDialog,
    }
  },
})
</script>
