<template>
  <q-item clickable @click="showDialog">
    <q-item-section>
      {{ $t('chat.addUser') }}
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { ClientResponseError } from 'pocketbase'
import { useChatIdFromRoute } from 'src/composables/route-chat-id.composable'
import { ChatMember } from 'src/models/chat.interface'
import { PbCollection } from 'src/models/pb-collection.enum'
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
        .collection(PbCollection.USER)
        .getFirstListItem(`username = "${username}"`)

      return id
    },

    async checkIfMember(userId: string, chatId: string): Promise<boolean> {
      try {
        await this.pb
          .collection(PbCollection.CHAT_MEMBER)
          .getFirstListItem(`user = "${userId}" && chat = "${chatId}"`)
        return true
      } catch (e) {
        if (e instanceof ClientResponseError && e.status === 404) {
          return false
        }

        throw e
      }
    },

    showErrorDialog(i18nSubpath: string) {
      this.$q.dialog({
        title: this.$t('chat.toolbar.dialog.addUserError.title'),
        message: this.$t(
          `chat.toolbar.dialog.addUserError.message.${i18nSubpath}`
        ),
        ok: {
          unelevated: true,
        },
      })
    },

    async processUserAdd(username: string) {
      const { chatId } = this

      let userId: string
      try {
        userId = await this.getUserId(username)
        console.debug('Username %s is id %s', username, userId)
      } catch (e) {
        if (e instanceof ClientResponseError && e.status === 404) {
          this.showErrorDialog('notFound')
          console.error('User %s was not found.', username)
        } else {
          this.showErrorDialog('generic')
          console.error(
            'Error encountered while looking for user %s',
            username,
            e
          )
        }

        return
      }

      if (await this.checkIfMember(userId, chatId)) {
        this.showErrorDialog('alreadyAdded')
        console.warn('User %s is already a member of chat %s', userId, chatId)
        return
      }

      try {
        await this.pb.collection(PbCollection.CHAT_MEMBER).create<ChatMember>({
          user: userId,
          chat: chatId,
        })
        console.log(
          'Successfully added user %s as member of chat %s',
          userId,
          chatId
        )
      } catch (e) {
        this.showErrorDialog('generic')
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
          },
        })
        .onOk((username) => {
          this.processUserAdd(username)
        })
    },
  },
})
</script>
