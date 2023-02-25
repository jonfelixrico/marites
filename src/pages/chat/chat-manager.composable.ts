import { usePocketbase } from 'src/services/pocketbase.service'
import { useMessageStore } from 'src/stores/message.store'
import { computed, onBeforeMount, onBeforeUnmount, Ref } from 'vue'
import { useMessageObservable } from 'src/services/message-observable.service'
import { Subscription } from 'rxjs'
import { PbCollection } from 'src/models/pb-collection.enum'
import { ChatMessage } from 'src/models/chat.interface'
import { useChatStore } from 'src/stores/chat.store'
import { useChatMessageApi } from 'src/composables/chat-message-api.composable'

function extractCreateDt(message?: ChatMessage) {
  return message?.created ? new Date(message.created) : new Date()
}

function useHistoryLoader(chatId: Ref<string>) {
  const store = useMessageStore()
  const { listMessagesBeforeCursorDate } = useChatMessageApi()

  async function loadOlderMessages(
    chatId: string,
    message?: ChatMessage,
    limit?: number
  ) {
    const items = await listMessagesBeforeCursorDate(
      {
        chatId,
        cursorDt: extractCreateDt(message),
      },
      {
        limit,
      }
    )

    if (!message) {
      return items
    }

    /*
     * We're not using find because the results will include the cursor (usually as the first item) and potentially
     * same-timestamp items which are lexicographically earlier than the id of the cursor.
     */
    const idx = items.findIndex(({ id }) => message.id === id)
    return items.slice(idx + 1)
  }

  /**
   *
   * @returns `true` if there are no more items left in the history, false if otherwise
   */
  return async function (): Promise<boolean> {
    const oldest = store.chats[chatId.value]?.[0]
    const loaded = await loadOlderMessages(chatId.value, oldest)

    if (!loaded.length) {
      return true
    }

    store.storeMessages('start', ...loaded)
    return false
  }
}

function useNewMessagesListener(chatId: Ref<string>) {
  const { observable } = useMessageObservable()
  const store = useMessageStore()

  let subscription: Subscription
  onBeforeMount(() => {
    subscription = observable.subscribe(({ record, action }) => {
      if (action !== 'create' || record.chat !== chatId.value) {
        return
      }

      store.storeMessage(record, 'end')
    })
  })

  onBeforeUnmount(() => {
    if (subscription) {
      subscription.unsubscribe()
    }
  })
}

function useMessageSender(chatId: Ref<string>) {
  const pb = usePocketbase()
  const chatStore = useChatStore()

  const chatMemberId = computed(() => {
    const userId = pb.authStore.model?.id
    if (!userId) {
      return
    }

    const membersArr = Object.values(chatStore.chatMembers[chatId.value] ?? [])
    return membersArr.find(({ user }) => user === userId)?.id
  })

  async function sendMessage(content: string) {
    const message = await pb
      .collection(PbCollection.CHAT_MESSAGE)
      .create<ChatMessage>({
        content,
        sender: chatMemberId.value,
        chat: chatId.value,
      })

    console.log(`Sent message ${message.id} to chatroom ${chatId.value}`)
  }

  return {
    sendMessage,
    chatMemberId,
  }
}

export function useChatManager(chatId: Ref<string>) {
  useNewMessagesListener(chatId)
  const load = useHistoryLoader(chatId)
  const store = useMessageStore()

  return {
    /**
     * A list where the messages are arranged from older to newer
     */
    history: computed(() => store.chats[chatId.value] ?? []),
    load,
    ...useMessageSender(chatId),
  }
}
