<template>
  <q-item clickable @click="showDialog">
    <q-item-section>
      {{ $t('chat.toolbar.addUser') }}
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { ClientResponseError } from 'pocketbase'
import { useChatIdFromRoute } from 'src/composables/route-chat-id.composable'
import { PBChatUserMembership } from 'src/models/pb-chat-user-membership.interface'
import { PBCollection } from 'src/models/pb-collection.enum'
import { usePocketbase } from 'src/services/pocketbase.service'
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    const pb = usePocketbase()
    const chatId = useChatIdFromRoute()

    return {
      pb,
      chatId,
    }
  },

  methods: {
    async getUserId(username: string) {
      const { id } = await this.pb
        .collection(PBCollection.USER)
        .getFirstListItem(`username = "${username}"`)

      return id
    },

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

    async processUserAdd(username: string) {
      const { chatId } = this

      // convert username to user id
      let userId: string
      try {
        userId = await this.getUserId(username)
        console.debug('Username %s is id %s', username, userId)
      } catch (e) {
        if (e instanceof ClientResponseError && e.status === 404) {
          this.showErrorDialog('notFound', username)
          console.error('User %s was not found.', username)
        } else {
          this.showErrorDialog('generic', username)
          console.error(
            'Error encountered while looking for user %s',
            username,
            e
          )
        }

        return
      }

      // add user to the chat
      try {
        await this.pb
          .collection(PBCollection.CHAT_USER_MEMBERSHIP)
          .create<PBChatUserMembership>({
            user: userId,
            chat: chatId,
          })
        console.log(
          'Successfully added user %s as member of chat %s',
          userId,
          chatId
        )

        this.$q.dialog({
          title: this.$t('chat.toolbar.dialog.addUserSuccess.title'),
          message: this.$t('chat.toolbar.dialog.addUserSuccess.message', {
            username,
          }),
          ok: {
            noCaps: true,
            unelevated: true,
          },
        })
      } catch (e) {
        if (e instanceof ClientResponseError && e.status === 400) {
          this.showErrorDialog('alreadyAdded', username)
          console.warn('User %s is already a member of chat %s', userId, chatId)
          return
        }

        this.showErrorDialog('generic', username)
        console.error('Error encountered while adding user %s', username, e)
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
