<template>
  <div class="column">
    <ChatToolbar class="border-bottom" />
    <div class="col relative-position">
      <div class="absolute fit scroll" @scroll.passive="scrollListener">
        <q-infinite-scroll @load="handleLoad" reverse>
          <div class="q-px-lg">
            <ChatMessage
              v-for="message of history"
              :key="message.id"
              :message="message"
              @vnode-mounted="compensateScrollForNewMessage(message.id)"
            />
          </div>
        </q-infinite-scroll>
      </div>
    </div>

    <div class="q-pa-xs q-pt-none bg-white border-top">
      <q-input
        type="textarea"
        name="content"
        v-model="contentModel"
        outlined
        @keypress.enter.exact.prevent="sendMessage"
        autogrow
        dense
        :placeholder="$t('chat.textboxPlaceholder')"
      />
    </div>
  </div>
</template>

<script lang="ts">
import ChatToolbar from 'src/components/chat-toolbar/ChatToolbar.vue'
import { useChatMessageApi } from 'src/composables/chat-message-api.composable'
import { useChatIdFromRoute } from 'src/composables/route-chat-id.composable'
import { useSessionApi } from 'src/composables/session-api.composable'
import { PBCollection } from 'src/models/pb-collection.enum'
import { usePocketbase } from 'src/services/pocketbase.service'
import { useMessageStore } from 'src/stores/message.store'
import { defineComponent, onBeforeUnmount, ref, Ref } from 'vue'
import { useChatManager } from './chat-manager.composable'
import { useChatScroll } from './chat-scroll.composable'
import ChatMessage from 'components/chat-message/ChatMessage.vue'

function useMessageClearOnUnmount(chatId: Ref<string>) {
  const store = useMessageStore()
  onBeforeUnmount(() => {
    store.clearMessages(chatId.value)
  })
}

export default defineComponent({
  components: { ChatToolbar, ChatMessage },

  setup() {
    const chatId = useChatIdFromRoute()
    const { getSessionUser } = useSessionApi()

    useMessageClearOnUnmount(chatId)

    const { history, ...others } = useChatManager(chatId)
    const { createMessage } = useChatMessageApi()

    const { scrollListener, keepScrollAtBottom, ...scrollManager } =
      useChatScroll()
    function onMessageMount(messageId: string) {
      const arr = history.value
      const lastMessageId = arr[arr.length - 1]?.id

      if (messageId === lastMessageId) {
        console.debug('New last message mounted: %s', messageId)
        keepScrollAtBottom()
      }
    }

    const contentModel = ref('')
    async function sendMessage() {
      const content = contentModel.value
      contentModel.value = ''
      await createMessage({
        content,
        chatId: chatId.value,
      })
    }

    return {
      ...others,
      history,

      userId: getSessionUser().id,
      contentModel,
      sendMessage,
      scrollListener,
      ...scrollManager,

      compensateScrollForNewMessage: onMessageMount,
    }
  },

  methods: {
    async handleLoad(index: number, doneFn: (stop: boolean) => void) {
      const isDone = await this.load()
      doneFn(isDone)
    },
  },

  async beforeRouteEnter(to) {
    const pb = usePocketbase()
    // to validate that the user has access to the specified chat
    await pb.collection(PBCollection.CHAT).getOne(String(to.params.chatId))
  },
})
</script>
