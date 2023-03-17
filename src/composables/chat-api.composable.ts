import { sortBy } from 'lodash'
import { merge, mergeMap } from 'rxjs'
import { APIChat, APIChatMember } from 'src/models/api-chat.interface'
import { PBChatUserMembership } from 'src/models/pb-chat-user-membership.interface'
import { PBChat } from 'src/models/pb-chat.interface'
import { PBCollection } from 'src/models/pb-collection.enum'
import { BasePBRecord } from 'src/models/pb-record.interface'
import { PBSubscriptionAction } from 'src/models/pb-subscription-action.enum'
import { usePocketbase } from 'src/services/pocketbase.service'
import { useSubscriptionManager } from 'src/services/subscription-manager.service'
import { wrapString } from 'src/utils/pocketbase.util'
import { useSessionApi } from './session-api.composable'
import { useChatJoinCodeAPI } from './chat-join-code-api.composable'

interface APICreateChatBody {
  name: string
}

interface RawAPIChatMember extends BasePBRecord {
  user: string
  chat: string
  expand: {
    user: {
      id: string
      username: string
    }
  }
}

/**
 * @private
 * @param param0
 * @returns
 */
function processRawAPIChatMember({
  expand,
  user,
  created,
}: RawAPIChatMember): APIChatMember {
  return {
    id: user,
    username: expand.user.username,
    joined: created,
  }
}

interface PBChatExpanded extends PBChat {
  expand: {
    owner: {
      username: string
    }
  }
}

export function useChatFetchAPI() {
  const pb = usePocketbase()

  async function hydrateChat(rawChat: PBChatExpanded): Promise<APIChat> {
    const { id, owner, expand, created } = rawChat
    const rawMembers = await pb
      .collection(PBCollection.CHAT_USER_MEMBERSHIP)
      .getFullList<RawAPIChatMember>(200, {
        filter: `chat.id = ${wrapString(id)}`,
        expand: 'user',
      })

    const members: APIChatMember[] = [
      /**
       * "Virtual" entry for chat owners.
       * Owners do not have their own member entry since they're already been included via the "owner" field.
       */
      {
        id: owner,
        username: expand.owner.username,
        isOwner: true,
        /*
         * Data-wise, the owner does not have its own join date. We're using the chat's creation date here because
         * the owner data gets bound during chat creation.
         */
        joined: created,
      },
      ...rawMembers.map(processRawAPIChatMember),
    ]

    return {
      ...rawChat,
      members: sortBy(members, (member) => member.username),
    }
  }

  async function getChat(chatId: string): Promise<APIChat> {
    const rawChat = await pb
      .collection(PBCollection.CHAT)
      .getOne<PBChatExpanded>(chatId, {
        expand: 'owner',
      })

    return await hydrateChat(rawChat)
  }

  async function listChats() {
    const rawChats = await pb
      .collection(PBCollection.CHAT)
      .getFullList<PBChatExpanded>(200, {
        expand: 'owner',
      })

    return await Promise.all(rawChats.map(hydrateChat))
  }

  async function getChatName(chatId: string) {
    const rawChat = await pb
      .collection(PBCollection.CHAT)
      .getOne<PBChatExpanded>(chatId)

    return rawChat?.name
  }

  return {
    getChat,
    hydrateChat,
    listChats,
    getChatName,
  }
}

export function useChatReactiveAPI() {
  const { getObservable } = useSubscriptionManager()
  const { getSessionUser } = useSessionApi()
  const { getChat } = useChatFetchAPI()

  function getChatListObservable() {
    const chat$ = getObservable<PBChat>(PBCollection.CHAT)
    const chatUserMembership$ = getObservable<PBChatUserMembership>(
      PBCollection.CHAT_USER_MEMBERSHIP
    )

    const userId = getSessionUser().id

    return merge(
      chat$.pipe(
        mergeMap(async ({ action, record }) => {
          if (action === PBSubscriptionAction.DELETE) {
            return {
              record: {
                id: record.id,
              },
              action,
            }
          }

          return {
            record: await getChat(record.id),
            action,
          }
        })
      ),
      chatUserMembership$.pipe(
        mergeMap(async ({ action, record }) => {
          if (
            action === PBSubscriptionAction.DELETE &&
            record.user === userId
          ) {
            return {
              record: {
                id: record.chat,
              },
              action,
            }
          }

          return {
            action: PBSubscriptionAction.UPDATE,
            record: await getChat(record.chat),
          }
        })
      )
    )
  }

  return {
    getChatListObservable,
  }
}

export function useChatApi() {
  const pb = usePocketbase()
  const { getSessionUser } = useSessionApi()
  const fetchAPI = useChatFetchAPI()
  const { createJoinCode } = useChatJoinCodeAPI()

  async function createChat({ name }: APICreateChatBody): Promise<APIChat> {
    const userId = getSessionUser().id

    const { id } = await pb.collection(PBCollection.CHAT).create<PBChat>({
      name,
      owner: userId,
    })
    await createJoinCode(id)

    return await fetchAPI.getChat(id)
  }

  return {
    createChat,

    /**
     * Use this composable directly
     * @deprecated
     */
    ...fetchAPI,

    /**
     * Use this composable directly
     */
    ...useChatReactiveAPI(),
  }
}
