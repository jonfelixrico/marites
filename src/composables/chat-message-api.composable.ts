import { PBChatMessage } from 'src/models/pb-chat-message.interface'
import { PBCollection } from 'src/models/pb-collection.enum'
import { usePocketbase } from 'src/services/pocketbase.service'
import { toFilterDate } from 'src/utils/pocketbase.util'
import { useSessionApi } from './session-api.composable'

interface APICreateMessageBody {
  chatId: string
  content: string
}

interface APIListMessagesBeforeCursorDateQuery {
  chatId: string
  cursorDt: Date
}

interface APIListMessagesBeforeCursorDateOptions {
  limit?: number
}

export function useChatMessageApi() {
  const pb = usePocketbase()
  const sessionApi = useSessionApi()

  async function createMessage({
    content,
    chatId,
  }: APICreateMessageBody): Promise<PBChatMessage> {
    return await pb
      .collection(PBCollection.CHAT_MESSAGE)
      .create<PBChatMessage>({
        content,
        sender: sessionApi.getSessionUser().id,
        chat: chatId,
      })
  }

  async function getLastMessage(chatId: string): Promise<PBChatMessage | null> {
    const { items } = await pb
      .collection(PBCollection.CHAT_MESSAGE)
      // can't use getFirstListItem here since it doesn't allow us to specify the ordering
      .getList<PBChatMessage>(1, 1, {
        sort: '-created', // sorting by id to keep sorting consistent for same-timestamp messages
        filter: `created <= "${toFilterDate(
          new Date()
        )}" && chat = "${chatId}"`,
      })

    return items[0] ?? null
  }

  async function listMessagesBeforeCursorDate(
    { chatId, cursorDt }: APIListMessagesBeforeCursorDateQuery,
    options?: APIListMessagesBeforeCursorDateOptions
  ): Promise<PBChatMessage[]> {
    const { items } = await pb
      .collection(PBCollection.CHAT_MESSAGE)
      .getList<PBChatMessage>(1, options?.limit ?? 30, {
        sort: '-created,-id', // sorting by id to keep sorting consistent for same-timestamp messages
        filter: `created <= "${toFilterDate(cursorDt)}" && chat = "${chatId}"`,
      })

    return items
  }

  return {
    createMessage,
    getLastMessage,
    listMessagesBeforeCursorDate,
  }
}
