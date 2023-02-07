import { usePocketbase } from 'src/services/pocketbase.service'
import { Message, useMessageStore } from 'src/stores/message.store'
import { Ref } from 'vue'

export function useSendMessage(chatRoomId: Ref<string>) {
  const pb = usePocketbase()
  const store = useMessageStore()

  async function sendMessage(content: string) {
    const message = await pb.collection('messages').create<Message>({
      content,
      senderId: [pb.authStore.model?.id],
      chatRoomId: chatRoomId.value,
    })

    store.storeMessage(message)
    console.log(`Sent message ${message.id} to chatroom ${chatRoomId.value}`)
  }

  return {
    sendMessage,
  }
}
