import { orderBy } from 'lodash'
import { usePocketbase } from 'src/services/pocketbase.service'
import { useMessageStore } from 'src/stores/message.store'
import { computed, onBeforeMount, onBeforeUnmount, Ref } from 'vue'
import type { QVirtualScrollProps } from 'quasar'
import { Message } from 'src/models/message.interface'
import { useMessageObservable } from 'src/services/message-observable.service'
import { useMessageStoreV2 } from 'src/stores/message-v2.store'
import { filter, Subscription } from 'rxjs'

function extractCreateDt(message?: Message) {
  return message?.created ?? new Date()
}

function useLoaders() {
  const pb = usePocketbase()
  const store = useMessageStore()

  async function loadNewerMessagse(
    chatRoomId: string,
    message?: Message,
    limit = 30
  ) {
    const anchorDt = extractCreateDt(message)

    const newerMessages = await pb
      .collection('messages')
      .getList<Message>(1, limit, {
        sort: 'created',
        filter: `created >= "${anchorDt}" && chatRoomId = "${chatRoomId}"`,
      })

    store.storeMessages(...newerMessages.items)
    return newerMessages
  }

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

    store.storeMessages(...olderMessages.items)
    return olderMessages
  }

  return {
    loadOlderMessages,
    loadNewerMessagse,
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

  const store = useMessageStore()
  const { loadOlderMessages } = useLoaders()

  /*
   * A list where the messages are arranged from older to newer
   */
  const history = computed(() => {
    const messages = store.chatRooms[chatRoomId.value]

    if (!messages) {
      return []
    }

    return orderBy<Message>(Object.values(messages), ['created'], ['asc'])
  })

  const handleVirtualScroll: QVirtualScrollProps['onVirtualScroll'] = async ({
    from,
  }) => {
    if (from !== 0) {
      return
    }

    await loadOlderMessages(chatRoomId.value, history.value[0])
  }

  return {
    history,
    handleVirtualScroll,
  }
}
