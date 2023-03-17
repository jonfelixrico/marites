import { usePocketbase } from 'src/services/pocketbase.service'
import { useSessionApi } from './session-api.composable'

import { ProjectErrorCode } from 'src/models/project-error-code.enum'
import { ProjectError } from 'src/models/project-error.class'
import { useChatFetchAPI } from './chat-api.composable'
import { PBCollection } from 'src/models/pb-collection.enum'
import { hasPBErrorStatus, wrapString } from 'src/utils/pocketbase.util'
import { APIChat } from 'src/models/api-chat.interface'

interface APIChatJoinBody {
  chatId: string
}

interface APIAddUserToChatBody {
  chatId: string
  userId: string
}

export function useChatMembershipAPI() {
  const pb = usePocketbase()
  const { getSessionUser } = useSessionApi()
  const { getChat } = useChatFetchAPI()

  async function hasUserAlreadyJoined(
    chatId: string,
    userId: string
  ): Promise<boolean> {
    try {
      await pb
        .collection(PBCollection.CHAT_USER_MEMBERSHIP)
        .getFirstListItem(
          `chat.id = ${wrapString(chatId)} && user.id = ${wrapString(userId)}`
        )
      return true
    } catch (e) {
      if (hasPBErrorStatus(e, 404)) {
        return false
      }

      throw e
    }
  }

  async function addToChatHelper(chatId: string, userId: string) {
    if (await hasUserAlreadyJoined(chatId, userId)) {
      throw new ProjectError(ProjectErrorCode.CHAT_MEMBER_ALREADY_JOINED)
    }

    await pb.collection(PBCollection.CHAT_USER_MEMBERSHIP).create({
      chat: chatId,
      user: userId,
    })
  }

  /**
   * Makes the session user add another user to the chat.
   *
   * WARNING: does not do verification if the adder has the necessary rights.
   * @param param0
   * @returns
   */
  async function addUserToChat({ chatId, userId }: APIAddUserToChatBody) {
    await addToChatHelper(chatId, userId)
    return await getChat(chatId)
  }

  /**
   * Makes the session user join a chat.
   * @param param0
   * @returns
   */
  async function joinChat({ chatId }: APIChatJoinBody): Promise<APIChat> {
    await addToChatHelper(chatId, getSessionUser().id)
    return await getChat(chatId)
  }

  return {
    joinChat,
    addUserToChat,
    hasUserAlreadyJoined,
  }
}
