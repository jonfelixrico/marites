import { useMessageStore } from 'src/stores/message.store'
import { computed, onBeforeMount, onBeforeUnmount, Ref } from 'vue'
import { Subscription } from 'rxjs'
import { useChatMessageApi } from 'src/composables/chat-message-api.composable'
import { useSubscriptionManager } from 'src/services/subscription-manager.service'
import { PBCollection } from 'src/models/pb-collection.enum'
import { PBChatMessage } from 'src/models/pb-chat-message.interface'

function extractCreateDt(message?: PBChatMessage) {
  return message?.created ? new Date(message.created) : new Date()
}

function useHistoryLoader(chatId: Ref<string>) {
  const store = useMessageStore()
  const { listMessagesBeforeCursorDate } = useChatMessageApi()

  async function loadOlderMessages(
    chatId: string,
    message?: PBChatMessage,
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
  const { getObservable } = useSubscriptionManager()
  const store = useMessageStore()

  let subscription: Subscription
  onBeforeMount(() => {
    subscription = getObservable<PBChatMessage>(
      PBCollection.CHAT_MESSAGE
    ).subscribe(({ record, action }) => {
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
  }
}
