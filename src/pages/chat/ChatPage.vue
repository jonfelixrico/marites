<template>
  <div class="column">
    <div class="col relative-position">
      <q-virtual-scroll
        class="absolute fit"
        :items="history"
        @virtual-scroll="handleVirtualScroll"
      >
        <template #default="{ item }">
          <div>
            {{ item.content }}
          </div>
        </template>
      </q-virtual-scroll>
    </div>
    <q-form
      @submit="sendMessage"
      class="row items-end q-gutter-x-xs"
      autofocus
      ref="form"
    >
      <q-input
        type="textarea"
        class="col"
        name="content"
        v-model="contentModel"
        outlined
        @keypress.enter.exact="triggerSubmit"
        autogrow
        dense
      />
      <q-btn type="submit" label="Send" color="primary" />
    </q-form>
  </div>
</template>

<script lang="ts">
import type { QForm } from 'quasar'
import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { useChatHistory } from './chat-history.composable'
import { useSendMessage } from './send-message.composable'

export default defineComponent({
  setup() {
    const route = useRoute()
    const chatRoomId = computed(() => route.params.chatRoomId as string)

    const { history, handleVirtualScroll } = useChatHistory(chatRoomId)

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
