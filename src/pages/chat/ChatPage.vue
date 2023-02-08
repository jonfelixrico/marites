<template>
  <div class="column">
    <q-scroll-area class="col">
      <q-infinite-scroll @load="handleLoad" reverse>
        <div v-for="message of history" :key="message.id">
          {{ message.content }}
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
        @keypress.enter.exact="triggerSubmit"
        autogrow
        dense
      />
      <q-btn type="submit" label="Send" color="primary" />
    </q-form>
  </div>
</template>

<script lang="ts">
import type { QForm } from 'quasar'
import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { useChatHistory } from './chat-history.composable'
import { useSendMessage } from './send-message.composable'

export default defineComponent({
  setup() {
    const route = useRoute()
    const chatRoomId = computed(() => route.params.chatRoomId as string)

    return {
      ...useSendMessage(chatRoomId),
      ...useChatHistory(chatRoomId),
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
