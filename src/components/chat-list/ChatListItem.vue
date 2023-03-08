<template>
  <q-item
    clickable
    @click="$router.push({ name: 'chat', params: { chatId: chat.id } })"
    :active="chat.id === $route.params.chatId"
  >
    <q-item-section>
      <div class="text-body1 text-weight-bold">
        {{ chat.name }}
      </div>
      <div v-if="previewMessage">
        <span class="text-weight-bold"> {{ previewMessage.username }}: </span>
        {{ previewMessage.content }}
      </div>
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { useChatStore } from 'src/stores/chat-v2.store'
import { APIChat } from 'src/models/api-chat.interface'

export default defineComponent({
  props: {
    chat: {
      type: Object as PropType<APIChat>,
      required: true,
    },
  },

  setup(props) {
    const store = useChatStore()

    return {
      previewMessage: computed(() => {
        const message = store.previewMessages[props.chat.id]

        if (!message) {
          return null
        }

        return {
          ...message,
          username: props.chat.members.find(
            (member) => member.id === message.sender
          )?.username,
        }
      }),
    }
  },
})
</script>
