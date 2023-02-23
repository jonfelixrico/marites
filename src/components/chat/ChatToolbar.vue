<template>
  <!-- TODO make color more suitable -->
  <q-toolbar class="row items-center bg-grey-1">
    <div>
      {{ chat?.name }}
    </div>
  </q-toolbar>
</template>

<script lang="ts">
import { useChatIdFromRoute } from 'src/composables/route-chat-id.composable'
import { useChatStore } from 'src/stores/chat.store'
import { computed, defineComponent } from 'vue'

export default defineComponent({
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

<style></style>
