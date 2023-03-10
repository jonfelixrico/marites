<template>
  <q-chat-message :sent="isSender">
    <template #default>
      <div style="white-space: pre" v-text="message.content" />
    </template>

    <!-- TODO use Vue-i18n date formatting for this -->
    <template #stamp>
      {{ message.created }}
    </template>

    <template v-if="!isSender" #name>{{ senderName }}</template>
  </q-chat-message>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue'
import { PBChatMessage } from 'src/models/pb-chat-message.interface'
import { useChatStore } from 'src/stores/chat.store'
import { useSessionApi } from 'src/composables/session-api.composable'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  props: {
    message: {
      required: true,
      type: Object as PropType<PBChatMessage>,
    },
  },

  setup(props) {
    const chatStore = useChatStore()
    const sessionAPI = useSessionApi()
    const { t } = useI18n()

    const isSender = computed(
      () => sessionAPI.getSessionUser().id === props.message.sender
    )
    const senderName = computed(() => {
      if (isSender.value) {
        return
      }

      const { chat, sender } = props.message

      return (
        chatStore.indexedChatMembers?.[chat]?.[sender]?.username ??
        t('chat.unkownUser')
      )
    })

    return {
      isSender,
      senderName,
    }
  },
})
</script>
