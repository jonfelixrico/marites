<template>
  <q-item
    clickable
    @click="$router.push({ name: 'chat', params: { chatRoomId: chatRoom.id } })"
    :active="chatRoom.id === $route.params.chatRoomId"
  >
    <q-item-section>
      <div>{{ chatRoom.name }}</div>
      <div>{{ message?.content }}</div>
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { ChatRoom } from 'src/models/chat-room.interface'
import { useChatRoomStore } from 'src/stores/chat-room.store'

export default defineComponent({
  props: {
    chatRoom: {
      type: Object as PropType<ChatRoom>,
      required: true,
    },
  },

  setup(props) {
    const store = useChatRoomStore()

    return {
      message: computed(() => store.messagePreview[props.chatRoom.id]),
    }
  },
})
</script>
