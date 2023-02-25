import { sortBy } from 'lodash'
import { PbCollection } from 'src/models/pb-collection.enum'
import { usePocketbase } from 'src/services/pocketbase.service'
import { wrapString } from 'src/utils/pocketbase.util'
import { useSessionApi } from './session-api.composable'

interface APICreateChatBody {
  name: string
}

interface RawAPIChatMember {
  id: string
  user: string
  chat: string
  expand: {
    user: {
      id: string
      username: string
    }
  }
  created: Date
}

interface APIChatMember {
  /**
   * Id of the user.
   */
  id: string
  username: string
  joined: Date
}

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

interface RawAPIChat {
  id: string
  name: string
  owner: string
  expand: {
    owner: {
      username: string
    }
  }
  created: Date
  updated: Date
}

interface APIChat {
  id: string
  name: string
  created: Date
  updated: Date
  members: {
    id: string
    username: string
    isOwner?: true
    joined: Date
  }[]
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

  async function listChatMembers(chatId: string): Promise<APIChatMember[]> {
    const members = await pb
      .collection(PbCollection.CHAT_USER_MEMBERSHIP)
      .getFullList<RawAPIChatMember>(200, {
        filter: `chat.id = ${wrapString(chatId)}`,
        expand: 'user.username',
      })

    return members.map(processRawAPIChatMember)
  }

  async function getChat(chatId: string): Promise<APIChat> {
    const { id, owner, expand, name, created, updated } = await pb
      .collection(PbCollection.CHAT)
      .getOne<RawAPIChat>(chatId, {
        expand: 'owner.username',
      })

    const apiMembers = await listChatMembers(chatId)
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

  return {
    createChat,
    getChat,
  }
}
