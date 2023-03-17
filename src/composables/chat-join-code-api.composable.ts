import { nanoid } from 'nanoid'
import { PBChatJoinCode } from 'src/models/pb-chat-join-code.interface'
import { PBCollection } from 'src/models/pb-collection.enum'
import { usePocketbase } from 'src/services/pocketbase.service'
import { wrapString } from 'src/utils/pocketbase.util'

export function useChatJoinCodeAPI() {
  const pb = usePocketbase()

  async function getIdFromJoinCode(joinCode: string): Promise<string> {
    const { chat } = await pb
      .collection(PBCollection.CHAT_JOIN_CODE)
      .getFirstListItem<PBChatJoinCode>(`joinCode = ${wrapString(joinCode)}`)

    return chat
  }

  async function getJoinCode(chatId: string): Promise<string> {
    const { joinCode } = await pb
      .collection(PBCollection.CHAT_JOIN_CODE)
      .getFirstListItem<PBChatJoinCode>(`chat = ${wrapString(chatId)}`)

    return joinCode
  }

  async function resetJoinCode(chatId: string): Promise<string> {
    const collection = await pb.collection(PBCollection.CHAT_JOIN_CODE)

    const { id } = await collection.getFirstListItem(
      `chat = ${wrapString(chatId)}`
    )

    const joinCode = nanoid()
    await pb
      .collection(PBCollection.CHAT_JOIN_CODE)
      .update<PBChatJoinCode>(id, {
        chat: chatId,
        joinCode,
      })

    return joinCode
  }

  async function createJoinCode(chatId: string) {
    const joinCode = nanoid()

    await pb.collection(PBCollection.CHAT_JOIN_CODE).create<PBChatJoinCode>({
      chat: chatId,
      joinCode,
    })

    return joinCode
  }

  return {
    getIdFromJoinCode,
    resetJoinCode,
    getJoinCode,
    createJoinCode,
  }
}
