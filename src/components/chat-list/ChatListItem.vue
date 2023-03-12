<template>
  <q-card flat bordered class="q-pa-sm hover-effects" :class="{ active }">
    <div class="text-body1 text-weight-bold">
      {{ chat.name }}
    </div>
    <div v-if="previewMessage">
      <span class="text-weight-bold text-primary">
        {{ previewMessage.username }}:
      </span>
      {{ previewMessage.content }}
    </div>
    <div v-else class="text-grey-7 text-italic">
      {{ $t('chat.noMessages') }}
    </div>
  </q-card>
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

    active: Boolean,
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
.hover-effects {
  &:hover {
    background: rgba(white, 0.15);
  }

  &.active {
    border-color: $primary;
  }
}
</style>
