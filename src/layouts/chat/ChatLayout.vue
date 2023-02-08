<template>
  <q-layout view="lHh Lpr lFf">
    <q-drawer v-model="showDrawer" class="column">
      <div class="col"></div>
      <q-btn @click="createChat" no-caps color="primary" unelevated>
        Create chat
      </q-btn>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { useMessageObservable } from 'src/services/message-observable.service'
import { defineComponent, onBeforeUnmount, ref } from 'vue'
import { useCreateChatRoom } from './create-chatroom.composable'

export default defineComponent({
  setup() {
    const { createChat } = useCreateChatRoom()

    const messageObservable = useMessageObservable()
    messageObservable.start()
    onBeforeUnmount(() => {
      messageObservable.stop()
    })

    const showDrawer = ref(true)

    return {
      createChat,
      showDrawer,
    }
  },
})
</script>
