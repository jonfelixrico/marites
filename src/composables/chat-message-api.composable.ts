import { PbCollection } from 'src/models/pb-collection.enum'
import { BasePBRecord } from 'src/models/pb-record.interface'
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

interface APIChatMessage extends BasePBRecord {
  content: string
  chat: string
  sender: string
}

export function useChatMessageApi() {
  const pb = usePocketbase()
  const sessionApi = useSessionApi()

  async function createMessage({
    content,
    chatId,
  }: APICreateMessageBody): Promise<APIChatMessage> {
    return await pb
      .collection(PbCollection.CHAT_MESSAGE)
      .create<APIChatMessage>({
        content,
        sender: sessionApi.getSessionUser(),
        chat: chatId,
      })
  }

  async function getLastMessage(
    chatId: string
  ): Promise<APIChatMessage | null> {
    const { items } = await pb
      .collection(PbCollection.CHAT_MESSAGE)
      // can't use getFirstListItem here since it doesn't allow us to specify the ordering
      .getList<APIChatMessage>(1, 1, {
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
  ): Promise<APIChatMessage[]> {
    const { items } = await pb
      .collection(PbCollection.CHAT_MESSAGE)
      .getList<APIChatMessage>(1, options?.limit ?? 30, {
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
