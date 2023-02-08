import { Message } from 'src/models/message.interface'
import { usePocketbase } from 'src/services/pocketbase.service'
import { useMessageStore } from 'src/stores/message.store'
import { ref, Ref } from 'vue'

export function useSendMessage(chatRoomId: Ref<string>) {
  const pb = usePocketbase()
  const store = useMessageStore()

  const contentModel = ref('')

  async function sendMessage() {
    const copy = contentModel.value
    contentModel.value = ''

    const message = await pb.collection('messages').create<Message>({
      content: copy,
      senderId: [pb.authStore.model?.id],
      chatRoomId: chatRoomId.value,
    })

    store.storeMessage(message)
    console.log(`Sent message ${message.id} to chatroom ${chatRoomId.value}`)
  }

  return {
    sendMessage,
    contentModel,
  }
}
