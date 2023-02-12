<template>
  <q-item
    clickable
    @click="$router.push({ name: 'chat', params: { chatRoomId: chatRoom.id } })"
    :active="chatRoom.id === $route.params.chatRoomId"
  >
    <q-item-section>
      <div>{{ chatRoom.name }}</div>
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
    chatRoom: {
      type: Object as PropType<Chat>,
      required: true,
    },
  },

  setup(props) {
    const id = computed(() => props.chatRoom.id)
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
