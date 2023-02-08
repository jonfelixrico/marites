import { usePocketbase } from 'src/services/pocketbase.service'
import { useMessageStoreV2 } from 'src/stores/message-v2.store'
import { computed, onBeforeMount, onBeforeUnmount, Ref } from 'vue'
import { Message } from 'src/models/message.interface'
import { useMessageObservable } from 'src/services/message-observable.service'
import { filter, Subscription } from 'rxjs'
import { toFilterDate } from 'src/utils/pocketbase.util'

function extractCreateDt(message?: Message) {
  return message?.created ? new Date(message.created) : new Date()
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

    const { items } = await pb
      .collection('messages')
      .getList<Message>(1, limit, {
        sort: '-created,id', // sorting by id to keep sorting consistent for same-timestamp messages
        filter: `created <= "${toFilterDate(
          anchorDt
        )}" && chatRoomId = "${chatRoomId}"`,
      })

    if (!message) {
      return items
    }

    /*
     * This is to remove the message that acted as a cursor from the results
     *
     * The reason we're not using a simple Array#filter is to also exclude any messages which are newer than the cursor
     * which got included in the results.
     *
     * A use case where this is possible is if there are other messages in the chatroom with the same timestamp as the cursor.
     *
     * Additionally, we didn't go for a filter where we just filter out all same-timestamp message in the results. This is because doing that
     * may make a same-timestamp message not show up if its position in the history is just before the cursor.
     */
    const idx = items.findIndex(({ id }) => message.id === id)
    return items.slice(idx)
  }

  /**
   *
   * @returns `true` if there are no more items left in the history, false if otherwise
   */
  async function load(): Promise<boolean> {
    const oldest = store.chatRooms[chatRoomId.value]?.[0]
    const loaded = await loadOlderMessages(chatRoomId.value, oldest)

    if (!loaded.length) {
      return true
    }

    store.storeMessages('start', ...loaded)
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
  const history = computed(() => store.chatRooms[chatRoomId.value] ?? [])

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
