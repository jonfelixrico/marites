import { PbCollection } from 'src/models/pb-collection.enum'
import { usePocketbase } from 'src/services/pocketbase.service'
import { useSessionApi } from './session-api.composable'

interface APICreateChatBody {
  name: string
}

interface APIChat {
  id: string
  name: string
  created: Date
  updated: Date
}

export function useChatApi() {
  const pb = usePocketbase()
  const { getSessionUser } = useSessionApi()

  async function createChat({ name }: APICreateChatBody) {
    const userId = getSessionUser().id

    await pb.collection(PbCollection.CHAT).create<APIChat>({
      name,
      owner: userId,
    })
  }

  return {
    createChat,
  }
}
