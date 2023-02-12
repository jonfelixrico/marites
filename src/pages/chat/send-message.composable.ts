import { usePocketbase } from 'src/services/pocketbase.service'
import { computed, ref, Ref } from 'vue'
import { PbCollection } from 'src/models/pb-collection.enum'
import { ChatMessage } from 'src/models/chat.interface'
import { useChatStore } from 'src/stores/chat.store'

export function useSendMessage(chatId: Ref<string>) {
  const pb = usePocketbase()
  const chatStore = useChatStore()

  const contentModel = ref('')

  const chatMember = computed(() => {
    const userId = pb.authStore.model?.id
    if (!userId) {
      return
    }

    return chatStore.chatMembers[chatId.value]?.[userId]
  })

  async function sendMessage() {
    const copy = contentModel.value
    contentModel.value = ''

    const message = await pb
      .collection(PbCollection.CHAT_MESSAGE)
      .create<ChatMessage>({
        content: copy,
        sender: chatMember.value?.id,
        chat: chatId.value,
      })

    console.log(`Sent message ${message.id} to chatroom ${chatId.value}`)
  }

  return {
    sendMessage,
    contentModel,
  }
}
