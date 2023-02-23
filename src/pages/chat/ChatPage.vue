<template>
  <q-page class="column">
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
import { ChatMember } from 'src/models/chat.interface'
import { PbCollection } from 'src/models/pb-collection.enum'
import { usePocketbase } from 'src/services/pocketbase.service'
import { useChatStore } from 'src/stores/chat.store'
import { useMessageStore } from 'src/stores/message.store'
import { defineComponent, onBeforeUnmount, ref, Ref } from 'vue'
import { useChatManager } from './chat-manager.composable'
import { useChatScroll } from './chat-scroll.composable'
import { useRouteChatId } from './route-chat-id.composable'

function useMessageClearOnUnmount(chatId: Ref<string>) {
  const store = useMessageStore()
  onBeforeUnmount(() => {
    store.clearMessages(chatId.value)
  })
}

export default defineComponent({
  setup() {
    const chatId = useRouteChatId()
    const pb = usePocketbase()

    useMessageClearOnUnmount(chatId)

    const {
      sendMessage: baseSendMessage,
      history,
      ...others
    } = useChatManager(chatId)

    const { scrollListener, compensateScroll } = useChatScroll()

    function compensateScrollForNewMessage(messageId: string) {
      const historyArr = history.value
      const lastMessageId = historyArr[historyArr.length - 1]?.id

      if (messageId === lastMessageId) {
        console.debug('New last message mounted: %s', messageId)
        compensateScroll()
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

      userId: pb.authStore?.model?.id,
      contentModel,
      sendMessage,
      scrollListener,

      compensateScrollForNewMessage,
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
    // TODO improve this
    const chatStore = useChatStore()
    const pb = usePocketbase()

    const chatId = String(to.params.chatId)
    await pb.collection(PbCollection.CHAT).getOne(chatId)

    const members = await pb
      .collection(PbCollection.CHAT_MEMBER)
      .getFullList<ChatMember>(200, {
        filter: `chat = "${chatId}"`,
        sort: 'created',
      })

    chatStore.storeChatMembers(...members)
  },
})
</script>
