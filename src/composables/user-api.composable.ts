import { nanoid } from 'nanoid'
import { PBCollection } from 'src/models/pb-collection.enum'
import { PBUserCode } from 'src/models/pb-user-code.interface'
import { usePocketbase } from 'src/services/pocketbase.service'
import { hasPBErrorStatus, wrapString } from 'src/utils/pocketbase.util'

export function useUserCodeAPI() {
  const pb = usePocketbase()

  async function getUserFromUserCode(code: string) {
    const { user } = await pb
      .collection(PBCollection.USER_CODE)
      .getFirstListItem<PBUserCode>(`code = ${wrapString(code)}`)
    return user
  }

  async function getUserCode(userId: string) {
    const { code } = await pb
      .collection(PBCollection.USER_CODE)
      .getFirstListItem<PBUserCode>(`user = ${wrapString(userId)}`)
    return code
  }

  async function resetUserCode(userId: string) {
    const collection = pb.collection(PBCollection.USER_CODE)

    let recordId: string | null = null
    try {
      const { id } = await collection.getFirstListItem<PBUserCode>(
        `user = ${wrapString(userId)}`
      )
      recordId = id
    } catch (e) {
      // user has no code yet
      if (!hasPBErrorStatus(e, 404)) {
        throw e
      }
    }

    const newUserCode = nanoid()
    if (!recordId) {
      console.warn(
        'No user code record found. Creating one with code %s',
        newUserCode
      )
      await collection.create<PBUserCode>({
        user: userId,
        code: newUserCode,
      } as PBUserCode)
    } else {
      console.log('Resetting user code %s', newUserCode)
      await collection.update<PBUserCode>(recordId, {
        code: newUserCode,
      } as PBUserCode)
    }

    return newUserCode
  }

  return {
    getUserFromUserCode,
    resetUserCode,
    getUserCode,
  }
}

export function useUserAPI() {
  const pb = usePocketbase()

  async function getUsername(userId: string) {
    const { username } = await pb.collection(PBCollection.USER).getOne(userId)
    return username
  }

  return {
    getUsername,
  }
}
