<template>
  <q-item clickable @click="showDialog">
    <q-item-section>
      {{ $t('chat.toolbar.addUser') }}
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { useChatIdFromRoute } from 'src/composables/route-chat-id.composable'
import { usePocketbase } from 'src/services/pocketbase.service'
import { defineComponent } from 'vue'
import { useChatMembershipAPI } from 'src/composables/chat-membership-api.composable'
import { useUserCodeAPI } from 'src/composables/user-api.composable'

export default defineComponent({
  setup() {
    const pb = usePocketbase()
    const chatId = useChatIdFromRoute()
    const { addUserToChat, hasUserAlreadyJoined } = useChatMembershipAPI()
    const { getUserFromUserCode } = useUserCodeAPI()

    return {
      pb,
      chatId,
      addUserToChat,
      getUserFromUserCode,
      hasUserAlreadyJoined,
    }
  },

  methods: {
    showErrorDialog(i18nSubpath: string, userId: string) {
      this.$q.dialog({
        title: this.$t('chat.toolbar.dialog.addUserError.title'),
        message: this.$t(
          `chat.toolbar.dialog.addUserError.message.${i18nSubpath}`,
          { userId }
        ),
        ok: {
          unelevated: true,
        },
      })
    },

    async processUserAdd(code: string) {
      const { chatId } = this

      try {
        const userId = await this.getUserFromUserCode(code)
        if (!userId) {
          this.showErrorDialog('notFound', code)
          console.warn('Did not find user associated with code %s', code)
          return
        }

        if (await this.hasUserAlreadyJoined(chatId, userId)) {
          this.showErrorDialog('alreadyAdded', userId)
          console.warn('User %s has already joined chat %s', userId, chatId)
          return
        }

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
        this.showErrorDialog('generic', code)
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
        .onOk(async (userId) => {
          try {
            this.$q.loading.show()
            await this.processUserAdd(userId)
          } finally {
            this.$q.loading.hide()
          }
        })
    },
  },
})
</script>
