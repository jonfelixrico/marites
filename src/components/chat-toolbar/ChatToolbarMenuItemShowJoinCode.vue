<template>
  <q-item clickable @click="showDialog">
    <q-item-section>
      {{ $t('chat.toolbar.showJoinCode') }}
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { useChatIdFromRoute } from 'src/composables/route-chat-id.composable'
import { useChatStore } from 'src/stores/chat.store'
import { defineComponent, computed } from 'vue'

export default defineComponent({
  setup() {
    const chatId = useChatIdFromRoute()
    const store = useChatStore()

    return {
      chat: computed(() => store.chats[chatId.value]),
    }
  },

  methods: {
    showDialog() {
      // TODO implement stuff
    },
  },
})
</script>
