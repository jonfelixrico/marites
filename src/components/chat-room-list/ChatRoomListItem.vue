<template>
  <q-item
    clickable
    @click="$router.push({ name: 'chat', params: { chatRoomId: chatRoom.id } })"
    :active="chatRoom.id === $route.params.chatRoomId"
  >
    <q-item-section>
      <div>{{ chatRoom.name }}</div>
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { ChatRoom } from 'src/models/chat-room.interface'

export default defineComponent({
  props: {
    chatRoom: {
      type: Object as PropType<ChatRoom>,
      required: true,
    },
  },
})
</script>
