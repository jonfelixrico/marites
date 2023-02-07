<template>
  <div class="column">
    <q-virtual-scroll class="col" :items="history">
      <template #default="{ item }">
        <div>
          {{ item.content }}
        </div>
      </template>
    </q-virtual-scroll>
    <q-form @submit="handleSubmit" class="row" autofocus>
      <q-input
        type="textarea"
        class="col"
        name="content"
        v-model="content"
        outlined
      />
      <q-btn type="submit" label="Send" color="primary" />
    </q-form>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useChatHistory } from './chat-history.composable'
import { useSendMessage } from './send-message.composable'

export default defineComponent({
  setup() {
    const content = ref('')

    const route = useRoute()
    const chatRoomId = computed(() => route.params.chatRoomId as string)

    const { history, handleVirtualScroll, loadOlderMessages } =
      useChatHistory(chatRoomId)
    const frozenHistory = computed(() => Object.freeze(history.value))

    onBeforeMount(async () => {
      if (history.value.length) {
        return
      }

      // this is to load initial messages, if none are loaded yet
      await loadOlderMessages(chatRoomId.value)
    })

    return {
      content,
      ...useSendMessage(chatRoomId),
      history: frozenHistory,
      handleVirtualScroll,
    }
  },

  methods: {
    async handleSubmit() {
      this.sendMessage(this.content)
      this.content = ''
    },
  },
})
</script>
