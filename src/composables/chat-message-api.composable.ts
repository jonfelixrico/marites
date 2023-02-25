import { PbCollection } from 'src/models/pb-collection.enum'
import { usePocketbase } from 'src/services/pocketbase.service'
import { useSessionApi } from './session-api.composable'

interface SendMessageBody {
  chatId: string
  content: string
}

interface APISendMessageResult {
  content: string
  chat: string
  user: string
  created: Date
  updated: Date
}

export function useChatMessageApi() {
  const pb = usePocketbase()
  const sessionApi = useSessionApi()

  async function sendMessage({ content, chatId }: SendMessageBody) {
    pb.collection(PbCollection.CHAT_MESSAGE).create<APISendMessageResult>({
      content,
      sender: sessionApi.getSessionUser(),
      chat: chatId,
    })
  }

  return {
    sendMessage,
  }
}
