<template>
  <q-list>
    <ChatListItem v-for="chat of chatList" :chat="chat" :key="chat.id" />
  </q-list>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, onBeforeUnmount } from 'vue'
import ChatListItem from './ChatListItem.vue'
import { useChatList } from './chat-list.composable'
import { useChatStore } from 'src/stores/chat-v2.store'
import { orderBy } from 'lodash'
import { Chat } from 'src/models/chat.interface'

export default defineComponent({
  components: { ChatListItem },
  setup() {
    const { loadChatList, subscribeToChatActivities } = useChatList()
    const store = useChatStore()

    let unsubscriber: () => void
    onBeforeMount(async () => {
      unsubscriber = subscribeToChatActivities()
      loadChatList()
    })

    onBeforeUnmount(() => {
      if (unsubscriber) {
        unsubscriber()
      }
    })

    const chatList = computed(() => {
      const values = Object.values(store.chats).map<Chat>((chat) => {
        return {
          ...chat,
          updated: store.previewMessages[chat.id]?.updated ?? chat.updated,
        }
      })
      return orderBy(values, ['updated'], ['desc'])
    })

    return {
      chatList,
    }
  },
})
</script>
