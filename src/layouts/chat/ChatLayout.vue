<template>
  <!-- TODO use QLayout here? -->
  <q-page class="row">
    <div class="col">
      <!-- TODO i18nize -->
      <q-btn @click="createChat">Create chat</q-btn>
    </div>
    <router-view class="col" />
  </q-page>
</template>

<script lang="ts">
import { useMessageObservable } from 'src/services/message-observable.service'
import { defineComponent, onBeforeUnmount } from 'vue'
import { useCreateChatRoom } from './create-chatroom.composable'

export default defineComponent({
  setup() {
    const { createChat } = useCreateChatRoom()

    const messageObservable = useMessageObservable()
    messageObservable.start()
    onBeforeUnmount(() => {
      messageObservable.stop()
    })

    return {
      createChat,
    }
  },
})
</script>
