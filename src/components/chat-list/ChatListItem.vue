<template>
  <q-item
    clickable
    @click="$router.push({ name: 'chat', params: { chatId: chat.id } })"
    :active="chat.id === $route.params.chatId"
    active-class="active-chat"
  >
    <q-item-section>
      <div class="text-body1 text-weight-bold">
        {{ chat.name }}
      </div>
      <div v-if="previewMessage">
        <span class="text-weight-bold text-primary">
          {{ previewMessage.username }}:
        </span>
        {{ previewMessage.content }}
      </div>
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { useChatStore } from 'src/stores/chat.store'
import { APIChat } from 'src/models/api-chat.interface'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  props: {
    chat: {
      type: Object as PropType<APIChat>,
      required: true,
    },
  },

  setup(props) {
    const store = useChatStore()
    const { t } = useI18n()

    const membersMap = computed(
      () => store.indexedChatMembers[props.chat.id] ?? {}
    )

    return {
      previewMessage: computed(() => {
        const message = store.previewMessages[props.chat.id]

        if (!message) {
          return null
        }

        return {
          ...message,
          username:
            membersMap.value[message.sender]?.username ?? t('chat.unknownUser'),
        }
      }),
    }
  },
})
</script>

<style lang="scss" scoped>
.active-chat {
  /*
   * Since we want the "hover" effect, we have to utilize q-focus-helper.
   * TODO find a better way for this. This is kind of hacky.
   */
  :deep(.q-focus-helper) {
    opacity: 0.1;
    background: $primary;
  }

  color: black;
}
</style>
