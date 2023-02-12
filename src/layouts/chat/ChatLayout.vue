<template>
  <q-layout view="hHh Lpr lFf">
    <q-header>
      <q-toolbar class="row justify-between">
        <q-btn icon="menu" round flat dense @click="showDrawer = !showDrawer" />
        <q-btn no-caps flat>Logout</q-btn>
      </q-toolbar>
    </q-header>
    <q-drawer v-model="showDrawer" class="column">
      <div class="col relative-position">
        <q-scroll-area class="absolute fit">
          <ChatRoomList />
        </q-scroll-area>
      </div>
      <div class="q-px-xs row">
        <q-btn
          class="col"
          @click="createChat"
          no-caps
          color="primary"
          unelevated
        >
          Create chat
        </q-btn>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view :key="String($route.params.chatRoomId)" />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import ChatRoomList from 'src/components/chat-room-list/ChatRoomList.vue'
import { useChatRoomObservable } from 'src/services/chat-room-observable.service'
import { useMessageObservable } from 'src/services/message-observable.service'
import { defineComponent, onBeforeUnmount, ref } from 'vue'
import { useCreateChatRoom } from './create-chatroom.composable'

export default defineComponent({
  components: { ChatRoomList },
  setup() {
    const { createChat } = useCreateChatRoom()

    const messageObservable = useMessageObservable()
    const chatRoomObservable = useChatRoomObservable()

    messageObservable.start()
    chatRoomObservable.start()

    onBeforeUnmount(() => {
      messageObservable.stop()
      chatRoomObservable.stop()
    })

    const showDrawer = ref(true)

    return {
      createChat,
      showDrawer,
    }
  },
})
</script>
