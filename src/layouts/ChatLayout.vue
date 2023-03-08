<template>
  <q-page class="row">
    <q-scroll-area class="col-2">
      <ChatList />
    </q-scroll-area>

    <router-view class="col" :key="String($route.params.chatId)" />
  </q-page>
</template>

<script lang="ts">
import ChatList from 'src/components/chat-list/ChatList.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  components: { ChatList },
})
</script>
