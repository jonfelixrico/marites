<template>
  <!-- TODO use QLayout here? -->
  <q-page class="row">
    <div class="col">
      <!-- TODO i18nize -->
      <q-btn @click="openCreateChatDialog">Create chat</q-btn>
    </div>
    <router-view class="col" />
  </q-page>
</template>

<script lang="ts">
import { useMessageObservable } from 'src/services/message-observable'
import { usePocketbase } from 'src/services/pocketbase.service'
import { defineComponent, onBeforeUnmount } from 'vue'

export default defineComponent({
  setup() {
    const messageObservable = useMessageObservable()
    messageObservable.start()

    onBeforeUnmount(() => {
      messageObservable.stop()
    })

    return {
      pb: usePocketbase(),
    }
  },

  methods: {
    openCreateChatDialog() {
      // TODO use custom component to make this comprehensive
      this.$q
        .dialog({
          title: 'Create chat',
          prompt: {
            model: '',
            type: 'text',
          },
          cancel: true,
        })
        .onOk(async (data: string) => {
          try {
            const chatRoomId = await this.createChat(data)
            await this.$router.push({
              name: 'chat',
              params: {
                chatRoomId,
              },
            })
          } catch (e) {
            console.error(e)
          }
        })
    },

    async createChat(name: string) {
      const { id } = await this.pb.collection('chatrooms').create({
        name,
        members: [this.pb.authStore.model?.id],
      })

      return id
    },
  },
})
</script>
