import { orderBy } from 'lodash'
import { usePocketbase } from 'src/services/pocketbase.service'
import { Message, useMessageStore } from 'src/stores/message.store'
import { computed } from 'vue'

interface Props {
  chatRoomId: string
}

type DoneCallback = (stop: boolean) => void

export function useChatHistory(props: Props) {
  const store = useMessageStore()

  const history = computed(() => {
    const messages = store.chatRooms[props.chatRoomId]

    if (!messages) {
      return []
    }

    return orderBy<Message>(Object.values(messages), ['created'], ['asc'])
  })

  async function load(cb: DoneCallback) {
    cb(true)
  }

  return {
    history,
    load,
  }
}

export function useSendMessage(props: Props) {
  const pb = usePocketbase()
  const store = useMessageStore()

  async function sendMessage(content: string) {
    const message = await pb.collection('messages').create<Message>({
      content,
      senderId: [pb.authStore.model?.id],
      chatRoomId: props.chatRoomId,
    })

    store.storeMessage(message)
  }

  return {
    sendMessage,
  }
}
