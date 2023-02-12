<template>
  <q-layout view="hHh Lpr lFf">
    <q-header>
      <q-toolbar class="row justify-between">
        <q-btn icon="menu" round flat dense @click="showDrawer = !showDrawer" />
        <q-btn no-caps flat @click="promptLogOut">{{
          $t('session.logOut')
        }}</q-btn>
      </q-toolbar>
    </q-header>
    <q-drawer v-model="showDrawer" class="column">
      <div class="col relative-position">
        <q-scroll-area class="absolute fit">
          <ChatList />
        </q-scroll-area>
      </div>
      <div class="q-px-xs column q-gutter-y-xs">
        <q-btn @click="createChat" no-caps color="primary" unelevated>
          Create chat
        </q-btn>
        <q-btn @click="joinChat" no-caps color="primary" unelevated>
          Join chat
        </q-btn>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view :key="String($route.params.chatId)" />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import ChatList from 'src/components/chat-list/ChatList.vue'
import { useChatObservable } from 'src/services/chat-observable.service'
import { useMessageObservable } from 'src/services/message-observable.service'
import { defineComponent, onBeforeUnmount, ref } from 'vue'
import { useCreateChat } from './create-chat.composable'
import { useSessionService } from 'src/services/session.service'
import { useJoinChat } from './join-chat.composable'

export default defineComponent({
  components: { ChatList },
  setup() {
    const createChat = useCreateChat()
    const joinChat = useJoinChat()

    const messageObservable = useMessageObservable()
    const chatObservable = useChatObservable()

    messageObservable.start()
    chatObservable.start()

    onBeforeUnmount(() => {
      messageObservable.stop()
      chatObservable.stop()
    })

    const showDrawer = ref(true)

    const { promptLogOut } = useSessionService()

    return {
      createChat,
      showDrawer,
      promptLogOut,
      joinChat,
    }
  },
})
</script>
