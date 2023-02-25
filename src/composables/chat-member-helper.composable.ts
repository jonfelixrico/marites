import { ChatMember } from 'src/models/chat.interface'
import { PbCollection } from 'src/models/pb-collection.enum'
import { usePocketbase } from 'src/services/pocketbase.service'
import { useChatStore } from 'src/stores/chat.store'

export function useChatMemberHelper() {
  const pb = usePocketbase()
  const store = useChatStore()

  async function fetchAndStoreMembers(chatId: string) {
    const members = await pb
      .collection(PbCollection.CHAT_MEMBER)
      .getFullList<ChatMember>(200, {
        filter: `chat = "${chatId}"`,
        sort: 'created',
      })

    store.storeChatMembers(...members)
  }

  return {
    fetchAndStoreMembers,
  }
}
