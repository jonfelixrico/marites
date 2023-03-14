<template>
  <q-item clickable @click="showDialog">
    <q-item-section>
      {{ $t('chat.toolbar.showJoinCode') }}
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { useQuasar } from 'quasar'
import { useChatIdFromRoute } from 'src/composables/route-chat-id.composable'
import { useChatStore } from 'src/stores/chat.store'
import { defineComponent, computed } from 'vue'
import ChatToolbarMenuItemShowJoinCodeDialog from './ChatToolbarMenuItemShowJoinCodeDialog.vue'

export default defineComponent({
  setup() {
    const chatId = useChatIdFromRoute()
    const store = useChatStore()
    const chat = computed(() => store.chats[chatId.value])

    const { dialog } = useQuasar()

    function showDialog() {
      dialog({
        component: ChatToolbarMenuItemShowJoinCodeDialog,
        componentProps: {
          joinCode: chat.value.joinCode,
        },
      })
    }

    return {
      chat,
      showDialog,
    }
  },
})
</script>
