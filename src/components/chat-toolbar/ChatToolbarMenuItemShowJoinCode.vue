<template>
  <q-item clickable @click="showDialog = true" v-bind="$attrs">
    <q-item-section>
      {{ $t('chat.toolbar.showJoinCode') }}
    </q-item-section>
  </q-item>

  <q-dialog v-model="showDialog">
    <q-card>
      <q-card-section class="text-h5">
        {{ $t('chat.toolbar.dialog.showJoinCode.title') }}
      </q-card-section>

      <q-card-section>
        {{ chat.joinCode }}
      </q-card-section>

      <q-card-actions align="right">
        <q-btn color="primary" no-caps unelevated>{{ $t('general.ok') }}</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { useChatIdFromRoute } from 'src/composables/route-chat-id.composable'
import { useChatStore } from 'src/stores/chat.store'
import { defineComponent, computed, ref } from 'vue'

export default defineComponent({
  setup() {
    const chatId = useChatIdFromRoute()
    const store = useChatStore()

    const showDialog = ref(false)

    return {
      chat: computed(() => store.chats[chatId.value]),
      showDialog,
    }
  },
})
</script>
