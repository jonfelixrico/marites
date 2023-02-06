<template>
  <div class="column">
    <q-infinite-scroll class="col" @load="handleLoad"></q-infinite-scroll>
    <q-form @submit="handleSubmit">
      <div class="row">
        <q-input type="textarea" v-model="content" />
      </div>
    </q-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useChatHistory, useSendMessage } from './chat-history.composable'

export default defineComponent({
  setup() {
    const content = ref('')
    const route = useRoute()

    return {
      content,
      ...useChatHistory(route.params as { chatRoomId: string }),
      ...useSendMessage(route.params as { chatRoomId: string }),
    }
  },

  methods: {
    async handleSubmit() {
      await this.sendMessage(this.content)
    },

    handleLoad(index: number, doneCb: (stop: boolean) => void) {
      this.load(doneCb)
    },
  },
})
</script>
