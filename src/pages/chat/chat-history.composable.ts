import { orderBy } from 'lodash'
import { Message, useMessageStore } from 'src/stores/message.store'
import { computed, Ref } from 'vue'

type DoneCallback = (stop: boolean) => void

export function useChatHistory(chatRoomId: Ref<string>) {
  const store = useMessageStore()

  const history = computed(() => {
    const messages = store.chatRooms[chatRoomId.value]

    if (!messages) {
      return []
    }

    return orderBy<Message>(Object.values(messages), ['created'], ['asc'])
  })

  /**
   * @deprecated
   * @param cb
   */
  async function load(cb: DoneCallback) {
    cb(true)
  }

  return {
    history,
    load,
  }
}
