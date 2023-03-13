<template>
  <q-item clickable @click="showDialog = true" v-bind="$attrs">
    <q-item-section>
      {{ $t('chat.toolbar.showJoinCode') }}
    </q-item-section>
  </q-item>

  <q-dialog v-model="showDialog">
    <q-card>
      <q-card-section class="text-h6 q-pb-none">
        {{ $t('chat.toolbar.dialog.showJoinCode.title') }}
      </q-card-section>

      <q-card-section>
        <i18n-t keypath="chat.toolbar.dialog.showJoinCode.message" tag="div">
          <template #joinCode>
            <q-btn dense no-caps unelevated @click="copyCode" v-close-popup>
              <div class="q-gutter-x-xs">
                <span>{{ chat.joinCode }}</span>
                <q-icon
                  class="text-weight-bold"
                  name="content_copy"
                  size="xs"
                />
              </div>
            </q-btn>
          </template>
        </i18n-t>
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
import { copyToClipboard, useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  setup() {
    const chatId = useChatIdFromRoute()
    const store = useChatStore()
    const chat = computed(() => store.chats[chatId.value])

    const showDialog = ref(false)

    const { notify } = useQuasar()
    const { t } = useI18n()

    async function copyCode() {
      await copyToClipboard(chat.value?.joinCode)
      notify(t('chat.toolbar.notif.joinCodeCopied'))
    }

    return {
      chat,
      showDialog,
      copyCode,
    }
  },
})
</script>
