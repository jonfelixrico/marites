import { orderBy } from 'lodash'
import { Message, useMessageStore } from 'src/stores/message.store'
import { computed } from 'vue'

interface Props {
  chatRoomId: string
}

export function useChatHistory(props: Props) {
  const store = useMessageStore()

  const history = computed(() => {
    const messages = store[props.chatRoomId]

    if (!messages) {
      return []
    }

    return orderBy<Message>(Object.values(messages), ['created'], ['asc'])
  })

  return {
    history,
  }
}
