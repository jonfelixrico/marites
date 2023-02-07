import { orderBy } from 'lodash'
import { usePocketbase } from 'src/services/pocketbase.service'
import { Message, useMessageStore } from 'src/stores/message.store'
import { computed, Ref } from 'vue'
import type { QVirtualScrollProps } from 'quasar'

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

export function useChatHistory(chatRoomId: Ref<string>) {
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
