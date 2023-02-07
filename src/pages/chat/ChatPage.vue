<template>
  <div class="column">
    <q-infinite-scroll class="col" @load="handleLoad">
      <div v-for="message of history" :key="message.id">
        {{ message.content }}
      </div>
    </q-infinite-scroll>
    <q-form @submit="handleSubmit" class="row" autofocus>
      <q-input
        type="textarea"
        class="col"
        name="content"
        v-model="content"
        outlined
      />
      <q-btn type="submit" label="Send" color="primary" />
    </q-form>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useChatHistory } from './chat-history.composable'
import { useSendMessage } from './send-message.composable'

export default defineComponent({
  setup() {
    const content = ref('')
    const route = useRoute()

    const chatRoomId = computed(() => route.params.chatRoomId as string)

    return {
      content,
      ...useChatHistory(route.params as { chatRoomId: string }),
      ...useSendMessage(chatRoomId),
    }
  },

  methods: {
    async handleSubmit() {
      this.sendMessage(this.content)
      this.content = ''
    },

    handleLoad(index: number, doneCb: (stop: boolean) => void) {
      this.load(doneCb)
    },
  },
})
</script>
