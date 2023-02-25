<template>
  <!-- TODO make color more suitable -->
  <q-toolbar class="row items-center justify-between">
    <div>
      {{ chat?.name }}
    </div>

    <ChatToolbarMenuButton />
  </q-toolbar>
</template>

<script lang="ts">
import { useChatIdFromRoute } from 'src/composables/route-chat-id.composable'
import { useChatStore } from 'src/stores/chat.store'
import { computed, defineComponent } from 'vue'
import ChatToolbarMenuButton from './ChatToolbarMenuButton.vue'

export default defineComponent({
  components: { ChatToolbarMenuButton },

  setup() {
    const chatId = useChatIdFromRoute()
    const store = useChatStore()

    const chat = computed(() => store.chats[chatId.value])

    return {
      chat,
    }
  },
})
</script>
