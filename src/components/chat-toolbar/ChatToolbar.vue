<template>
  <!-- TODO make color more suitable -->
  <q-toolbar class="row items-center justify-between bg-white">
    <div class="row items-center q-gutter-x-sm">
      <q-btn icon="close" flat round dense size="sm" @click="closeChat" />
      <div>
        {{ chat?.name }}
      </div>
    </div>

    <ChatToolbarMenuButton />
  </q-toolbar>
</template>

<script lang="ts">
import { useChatIdFromRoute } from 'src/composables/route-chat-id.composable'
import { useChatStore } from 'src/stores/chat-v2.store'
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

  methods: {
    closeChat() {
      this.$router.push({
        name: 'chatIndex',
      })
    },
  },
})
</script>
