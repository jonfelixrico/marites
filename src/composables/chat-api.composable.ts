import { sortBy } from 'lodash'
import { ClientResponseError } from 'pocketbase'
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

interface APICreateChatBody {
  name: string
}

interface APIChatJoinBody {
  chatId: string
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

/**
 * @private
 * @returns
 */
function useFetchMethods() {
  const pb = usePocketbase()
  async function hydrateChatMembers(chatId: string): Promise<APIChatMember[]> {
    const members = await pb
      .collection(PBCollection.CHAT_USER_MEMBERSHIP)
      .getFullList<RawAPIChatMember>(200, {
        filter: `chat.id = ${wrapString(chatId)}`,
        expand: 'user',
      })

    return members.map(processRawAPIChatMember)
  }

  async function hydrateChat({
    id,
    owner,
    expand,
    name,
    created,
    updated,
  }: PBChatExpanded): Promise<APIChat> {
    const apiMembers = await hydrateChatMembers(id)
    const members: APIChat['members'] = [
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
      ...apiMembers,
    ]

    return {
      id,
      name,
      created,
      updated,
      members: sortBy(members, (member) => member.username),
    }
  }

  async function getChat(chatId: string) {
    const rawChat = await pb
      .collection(PBCollection.CHAT)
      .getOne<PBChatExpanded>(chatId, {
        expand: 'owner',
      })

    return await hydrateChat(rawChat)
  }

  return {
    getChat,
    hydrateChat,
  }
}

/**
 * Contains methods related to joining people into chats.
 * @private
 */
function useAddMemberMethods() {
  const pb = usePocketbase()
  const { getSessionUser } = useSessionApi()
  const { getChat } = useFetchMethods()

  async function hasUserAlreadyJoined(
    chatId: string,
    userId: string
  ): Promise<boolean> {
    try {
      await pb
        .collection(PBCollection.CHAT_USER_MEMBERSHIP)
        .getFirstListItem(`chat.id = ${chatId} && user.id = ${userId}`)
      return true
    } catch (e) {
      if (e instanceof ClientResponseError && e.status === 404) {
        return false
      }

      throw e
    }
  }

  async function joinChat({ chatId }: APIChatJoinBody): Promise<APIChat> {
    if (!hasUserAlreadyJoined) {
      // TODO make custom error
      throw new Error('User already joined.')
    }

    await pb.collection(PBCollection.CHAT_USER_MEMBERSHIP).create({
      chat: chatId,
      user: getSessionUser().id,
    })
    return await getChat(chatId)
  }

  return {
    joinChat,
  }
}

export function useChatApi() {
  const pb = usePocketbase()
  const { getSessionUser } = useSessionApi()
  const { getObservable } = useSubscriptionManager()
  const { getChat, hydrateChat } = useFetchMethods()

  async function createChat({ name }: APICreateChatBody): Promise<APIChat> {
    const userId = getSessionUser().id

    const { id } = await pb.collection(PBCollection.CHAT).create<APIChat>({
      name,
      owner: userId,
    })

    return await getChat(id)
  }

  async function listChats() {
    const rawChats = await pb
      .collection(PBCollection.CHAT)
      .getFullList<PBChatExpanded>(200, {
        expand: 'owner',
      })

    return await Promise.all(rawChats.map(hydrateChat))
  }

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
            record: await getChat(record.id),
          }
        })
      )
    )
  }

  return {
    createChat,
    getChat,
    listChats,
    getChatListObservable,
    ...useAddMemberMethods(),
  }
}
