<template>
  <div class="column">
    <q-scroll-area class="col">
      <q-infinite-scroll @load="handleLoad" reverse>
        <div class="q-px-lg">
          <q-chat-message
            v-for="message of history"
            :key="message.id"
            :sent="userId === message.senderId"
          >
            <template #default>
              <div style="white-space: pre" v-text="message.content" />
            </template>

            <template #stamp>
              {{ message.created }}
            </template>
          </q-chat-message>
        </div>
      </q-infinite-scroll>
    </q-scroll-area>
    <q-form
      @submit="sendMessage"
      class="row items-end q-gutter-x-xs"
      autofocus
      ref="form"
    >
      <q-input
        type="textarea"
        class="col"
        name="content"
        v-model="contentModel"
        outlined
        @keypress.enter.exact.prevent="triggerSubmit"
        autogrow
        dense
      />
      <q-btn type="submit" label="Send" color="primary" />
    </q-form>
  </div>
</template>

<script lang="ts">
import type { QForm } from 'quasar'
import { usePocketbase } from 'src/services/pocketbase.service'
import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { useChatHistory } from './chat-history.composable'
import { useSendMessage } from './send-message.composable'

export default defineComponent({
  setup() {
    const route = useRoute()
    const chatRoomId = computed(() => route.params.chatRoomId as string)
    const pb = usePocketbase()

    return {
      ...useSendMessage(chatRoomId),
      ...useChatHistory(chatRoomId),
      userId: pb.authStore?.model?.id,
    }
  },

  methods: {
    triggerSubmit() {
      const form = this.$refs.form as QForm
      form.submit()
    },

    async handleLoad(index: number, doneFn: (stop: boolean) => void) {
      const isDone = await this.load()
      doneFn(isDone)
    },
  },
})
</script>
