<template>
  <div class="column">
    <q-virtual-scroll class="col" :items="history">
      <template #default="{ item }">
        <div>
          {{ item.content }}
        </div>
      </template>
    </q-virtual-scroll>
    <q-form @submit="sendMessage" class="row" autofocus ref="form">
      <q-input
        type="textarea"
        class="col"
        name="content"
        v-model="contentModel"
        outlined
        @keypress.enter.exact="triggerSubmit"
      />
      <q-btn type="submit" label="Send" color="primary" />
    </q-form>
  </div>
</template>

<script lang="ts">
import type { QForm } from 'quasar'
import { computed, defineComponent, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import { useChatHistory } from './chat-history.composable'
import { useSendMessage } from './send-message.composable'

export default defineComponent({
  setup() {
    const route = useRoute()
    const chatRoomId = computed(() => route.params.chatRoomId as string)

    const { history, handleVirtualScroll, loadOlderMessages } =
      useChatHistory(chatRoomId)

    onBeforeMount(async () => {
      if (history.value.length) {
        return
      }

      // this is to load initial messages, if none are loaded yet
      await loadOlderMessages(chatRoomId.value)
    })

    return {
      ...useSendMessage(chatRoomId),

      // freezing is recommended as per the QVirtualScroll docs (https://quasar.dev/vue-components/virtual-scroll#usage)
      history: computed(() => Object.freeze(history.value)),
      handleVirtualScroll,
    }
  },

  methods: {
    triggerSubmit() {
      const form = this.$refs.form as QForm
      form.submit()
    },
  },
})
</script>
