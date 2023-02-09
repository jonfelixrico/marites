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
import { computed, defineComponent, onBeforeMount, onBeforeUnmount } from 'vue'
import ChatRoomListItem from './ChatRoomListItem.vue'
import { useChatRoomList } from './chat-room-list.composable'
import { useChatRoomStore } from 'src/stores/chat-room.store'
import { orderBy } from 'lodash'
import { ChatRoom } from 'src/models/chat-room.interface'

export default defineComponent({
  components: { ChatRoomListItem },
  setup() {
    const { loadChatRoomList, listenForChatRoomListUpdates } = useChatRoomList()
    const store = useChatRoomStore()

    let unsubscriber: () => void
    onBeforeMount(async () => {
      unsubscriber = listenForChatRoomListUpdates()
      loadChatRoomList()
    })

    onBeforeUnmount(() => {
      if (unsubscriber) {
        unsubscriber()
      }
    })

    const chatRoomList = computed(() => {
      const values = Object.values(store.chatRooms).map<ChatRoom>(
        (chatRoom) => {
          return {
            ...chatRoom,
            updated:
              store.previewMessages[chatRoom.id]?.updated ?? chatRoom.updated,
          }
        }
      )
      return orderBy(values, ['updated'], ['desc'])
    })

    return {
      chatRoomList,
    }
  },
})
</script>
