<template>
  <q-page class="column">
    <ChatToolbar />
    <div class="col relative-position">
      <div class="absolute fit scroll" @scroll.passive="scrollListener">
        <q-infinite-scroll @load="handleLoad" reverse>
          <div class="q-px-lg">
            <q-chat-message
              v-for="message of history"
              :key="message.id"
              :sent="chatMemberId === message.sender"
              @vnode-mounted="compensateScrollForNewMessage(message.id)"
            >
              <template #default>
                <div style="white-space: pre" v-text="message.content" />
              </template>

              <template #stamp>
                {{ message.created }}
              </template>
            </q-chat-message>
          </div>
        </q-infinite-scroll>
      </div>
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
        @keypress.enter.exact.prevent="triggerSubmit"
        autogrow
        dense
      />
      <q-btn type="submit" label="Send" color="primary" />
    </q-form>
  </q-page>
</template>

<script lang="ts">
import type { QForm } from 'quasar'
import ChatToolbar from 'src/components/chat-toolbar/ChatToolbar.vue'
import { useChatMemberHelper } from 'src/composables/chat-member-helper.composable'
import { useChatIdFromRoute } from 'src/composables/route-chat-id.composable'
import { useSessionApi } from 'src/composables/session-api.composable'
import { PBCollection } from 'src/models/pb-collection.enum'
import { usePocketbase } from 'src/services/pocketbase.service'
import { useMessageStore } from 'src/stores/message.store'
import { defineComponent, onBeforeMount, onBeforeUnmount, ref, Ref } from 'vue'
import { useChatManager } from './chat-manager.composable'
import { useChatScroll } from './chat-scroll.composable'

function useMessageClearOnUnmount(chatId: Ref<string>) {
  const store = useMessageStore()
  onBeforeUnmount(() => {
    store.clearMessages(chatId.value)
  })
}

function useLoadChatMembersOnMount() {
  const { fetchAndStoreMembers } = useChatMemberHelper()
  const chatId = useChatIdFromRoute()

  onBeforeMount(async () => {
    try {
      await fetchAndStoreMembers(chatId.value)
      console.log('Successfully loaded members for chat %s', chatId.value)
    } catch (e) {
      console.error('Failed to load members for chat %s', chatId.value, e)
    }
  })
}

export default defineComponent({
  components: { ChatToolbar },

  setup() {
    const chatId = useChatIdFromRoute()
    const { getSessionUser } = useSessionApi()

    useMessageClearOnUnmount(chatId)
    useLoadChatMembersOnMount()

    const {
      sendMessage: baseSendMessage,
      history,
      ...others
    } = useChatManager(chatId)

    const { scrollListener, keepScrollAtBottom } = useChatScroll()
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
      const copy = contentModel.value
      contentModel.value = ''
      await baseSendMessage(copy)
    }

    return {
      ...others,
      history,

      userId: getSessionUser().id,
      contentModel,
      sendMessage,
      scrollListener,

      compensateScrollForNewMessage: onMessageMount,
    }
  },

  methods: {
    triggerSubmit() {
      const form = this.$refs.form as QForm
      form.submit()
    },

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
