<template>
  <q-item
    clickable
    @click="$router.push({ name: 'chat', params: { chatId: chat.id } })"
    :active="chat.id === $route.params.chatId"
  >
    <q-item-section>
      <div>{{ chat.name }}</div>
      <div>{{ previewMessage?.content }}</div>
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onBeforeMount,
  PropType,
  onBeforeUnmount,
} from 'vue'
import { Chat } from 'src/models/chat.interface'
import { usePreviewMessage } from './preview-message.composable'

export default defineComponent({
  props: {
    chat: {
      type: Object as PropType<Chat>,
      required: true,
    },
  },

  setup(props) {
    const id = computed(() => props.chat.id)
    const { listenForLatestMessage, fetchLatestMessage, previewMessage } =
      usePreviewMessage(id)

    let unsubscriber: () => void
    onBeforeMount(async () => {
      unsubscriber = listenForLatestMessage()
      fetchLatestMessage()
    })

    onBeforeUnmount(() => {
      if (unsubscriber) {
        unsubscriber()
      }
    })

    return {
      previewMessage,
    }
  },
})
</script>
