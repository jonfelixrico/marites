import { PbCollection } from 'src/models/pb-collection.enum'
import { usePocketbase } from 'src/services/pocketbase.service'
import { toFilterDate } from 'src/utils/pocketbase.util'
import { useSessionApi } from './session-api.composable'

interface SendMessageBody {
  chatId: string
  content: string
}

interface APIChatMessage {
  content: string
  chat: string
  sender: string
  created: Date
  updated: Date
  id: string
}

export function useChatMessageApi() {
  const pb = usePocketbase()
  const sessionApi = useSessionApi()

  async function createMessage({
    content,
    chatId,
  }: SendMessageBody): Promise<APIChatMessage> {
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

  return {
    createMessage,
    getLastMessage,
  }
}
