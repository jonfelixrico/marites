<template>
  <q-page class="row">
    <div class="col-2 column">
      <div class="q-pa-xs">
        <q-btn @click="setShowDrawer(true)" icon="menu" flat round dense />
      </div>
      <q-scroll-area class="col">
        <ChatList />
      </q-scroll-area>
    </div>

    <router-view class="col bg-grey-3" :key="String($route.params.chatId)" />
  </q-page>
</template>

<script lang="ts">
import ChatList from 'src/components/chat-list/ChatList.vue'
import { useMainLayoutStore } from 'src/stores/main-layout.store'
import { defineComponent } from 'vue'

export default defineComponent({
  components: { ChatList },

  setup() {
    const { setShowDrawer } = useMainLayoutStore()

    return {
      setShowDrawer,
    }
  },
})
</script>
