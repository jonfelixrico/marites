<template>
  <q-item clickable @click="showDialog">
    <q-item-section>
      {{ $t('chat.toolbar.addUser') }}
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { useChatApi } from 'src/composables/chat-api.composable'
import { useChatIdFromRoute } from 'src/composables/route-chat-id.composable'
import { usePocketbase } from 'src/services/pocketbase.service'
import { defineComponent } from 'vue'
import { ProjectError } from 'src/models/project-error.class'
import { ProjectErrorCode } from 'src/models/project-error-code.enum'

export default defineComponent({
  setup() {
    const pb = usePocketbase()
    const chatId = useChatIdFromRoute()
    const { addUserToChat } = useChatApi()

    return {
      pb,
      chatId,
      addUserToChat,
    }
  },

  methods: {
    showErrorDialog(i18nSubpath: string, username: string) {
      this.$q.dialog({
        title: this.$t('chat.toolbar.dialog.addUserError.title'),
        message: this.$t(
          `chat.toolbar.dialog.addUserError.message.${i18nSubpath}`,
          { username }
        ),
        ok: {
          unelevated: true,
        },
      })
    },

    async processUserAdd(userId: string) {
      const { chatId } = this

      try {
        await this.addUserToChat({ chatId, userId })
        this.$q.dialog({
          title: this.$t('chat.toolbar.dialog.addUserSuccess.title'),
          message: this.$t('chat.toolbar.dialog.addUserSuccess.message', {
            userId,
          }),
          ok: {
            noCaps: true,
            unelevated: true,
          },
        })
      } catch (e) {
        if (e instanceof ProjectError) {
          if (e.code === ProjectErrorCode.USER_USERNAME_NOT_FOUND) {
            console.error('User %s was not found.', userId)
            this.showErrorDialog('notFound', userId)
            return
          } else if (e.code === ProjectErrorCode.CHAT_MEMBER_ALREADY_JOINED) {
            console.warn(
              'User %s is already a member of chat %s',
              userId,
              chatId
            )
            this.showErrorDialog('alreadyAdded', userId)
            return
          }
        }

        this.showErrorDialog('generic', userId)
        console.error('Error encountered', e)
      }
    },

    showDialog() {
      // TODO use a custom dialog
      this.$q
        .dialog({
          title: this.$t('chat.toolbar.dialog.addUser.title'),
          message: this.$t('chat.toolbar.dialog.addUser.message'),
          prompt: {
            model: '',
            type: 'text',
          },
          cancel: {
            noCaps: true,
            flat: true,
          },
          ok: {
            label: this.$t('chat.toolbar.dialog.addUser.ok'),
            unelevated: true,
            color: 'primary',
            noCaps: true,
          },
        })
        .onOk(async (username) => {
          try {
            this.$q.loading.show()
            await this.processUserAdd(username)
          } finally {
            this.$q.loading.hide()
          }
        })
    },
  },
})
</script>
