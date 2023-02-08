import { usePocketbase } from 'src/services/pocketbase.service'
import { useMessageStoreV2 } from 'src/stores/message-v2.store'
import { computed, onBeforeMount, onBeforeUnmount, Ref } from 'vue'
import { Message } from 'src/models/message.interface'
import { useMessageObservable } from 'src/services/message-observable.service'
import { filter, Subscription } from 'rxjs'

function extractCreateDt(message?: Message) {
  return message?.created ?? new Date()
}

function useHistoryLoader(chatRoomId: Ref<string>) {
  const pb = usePocketbase()
  const store = useMessageStoreV2()

  async function loadOlderMessages(
    chatRoomId: string,
    message?: Message,
    limit = 30
  ) {
    const anchorDt = extractCreateDt(message)

    const olderMessages = await pb
      .collection('messages')
      .getList<Message>(1, limit, {
        sort: '-created',
        filter: `created <= "${anchorDt}" && chatRoomId = "${chatRoomId}"`,
      })

    return olderMessages.items
  }

  async function load(): Promise<boolean> {
    const history = store.chatRooms[chatRoomId.value]
    const oldest = history[history.length - 1] ?? null

    const loaded = await loadOlderMessages(chatRoomId.value, oldest)

    if (!oldest) {
      store.storeMessages('start', ...loaded)
      return false
    }

    const toStore: Message[] = []
    for (let i = loaded.length - 1; i <= 0; i--) {
      const message = loaded[i]
      if (oldest.id === message.id) {
        break
      }

      toStore.unshift(message)
    }

    if (!toStore.length) {
      return true
    }

    store.storeMessages('start', ...toStore)
    return false
  }

  return {
    load,
  }
}

function useNewMessagesListener(chatRoomId: Ref<string>) {
  const { observable } = useMessageObservable()
  const store = useMessageStoreV2()

  let subscription: Subscription
  onBeforeMount(() => {
    subscription = observable
      .pipe(
        filter(
          ({ action, record }) =>
            action === 'create' && record.chatRoomId === chatRoomId.value
        )
      )
      .subscribe(({ record }) => {
        store.storeMessage(record, 'end')
      })
  })

  onBeforeUnmount(() => {
    if (subscription) {
      subscription.unsubscribe()
    }
  })
}

export function useChatHistory(chatRoomId: Ref<string>) {
  useNewMessagesListener(chatRoomId)
  const { load } = useHistoryLoader(chatRoomId)

  const store = useMessageStoreV2()

  /*
   * A list where the messages are arranged from older to newer
   */
  const history = computed(() => store.chatRooms[chatRoomId.value])

  return {
    history,
    load,

    /**
     * @deprecated
     */
    handleVirtualScroll: () => {
      // empty method
    },
  }
}
