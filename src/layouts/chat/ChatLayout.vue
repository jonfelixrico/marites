<template>
  <q-layout view="hHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-btn icon="menu" round flat dense @click="showDrawer = !showDrawer" />
      </q-toolbar>
    </q-header>
    <q-drawer v-model="showDrawer" class="column">
      <div class="col"></div>
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
