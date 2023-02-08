<template>
  <q-list>
    <ChatRoomListItem
      v-for="chatRoom of chatRoomList"
      :chat-room="chatRoom"
      :key="chatRoom.id"
    />
  </q-list>
</template>

<script lang="ts">
import { ChatRoom } from 'src/models/chat-room.interface'
import { usePocketbase } from 'src/services/pocketbase.service'
import { computed, defineComponent, onBeforeMount } from 'vue'
import { useChatRoomStore } from 'src/stores/chat-room.store'
import ChatRoomListItem from './ChatRoomListItem.vue'

export default defineComponent({
  components: { ChatRoomListItem },
  setup() {
    const pb = usePocketbase()
    const store = useChatRoomStore()

    onBeforeMount(async () => {
      const items = await pb
        .collection('chatRooms')
        .getFullList<ChatRoom>(200, {
          sort: 'created',
        })

      for (const item of items) {
        store.storeChatRoom(item)
      }
    })

    const chatRoomList = computed(() => store.chatRooms)

    return {
      chatRoomList,
    }
  },
})
</script>
