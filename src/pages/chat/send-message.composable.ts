import { usePocketbase } from 'src/services/pocketbase.service'
import { ref, Ref } from 'vue'
import { PbCollection } from 'src/models/pb-collection.enum'
import { ChatMessage } from 'src/models/chat.interface'
import { useChatStore } from 'src/stores/chat.store'

export function useSendMessage(chatId: Ref<string>) {
  const pb = usePocketbase()
  const chatStore = useChatStore()

  const contentModel = ref('')

  async function sendMessage() {
    const copy = contentModel.value
    contentModel.value = ''

    const message = await pb
      .collection(PbCollection.CHAT_MESSAGE)
      .create<ChatMessage>({
        content: copy,
        sender: chatStore.sessionUserMember[chatId.value]?.id,
        chat: chatId.value,
      })

    console.log(`Sent message ${message.id} to chatroom ${chatId.value}`)
  }

  return {
    sendMessage,
    contentModel,
  }
}
