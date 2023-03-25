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
    const collection = pb.collection(PBCollection.USER_CODE)

    try {
      const { code } = await collection.getFirstListItem<PBUserCode>(
        `user = ${wrapString(userId)}`
      )
      return code
    } catch (e) {
      /*
       * A 404 error means that the code has not been generated for the user.
       * We will be generatin them outside past this try-catch.
       *
       * Non-404 errors are unexpected so we will be re-throwing them for caller
       * handling.
       */
      if (!hasPBErrorStatus(e, 404)) {
        throw e
      }
    }

    console.warn('No user code generated yet. Generating...')
    const newUserCode = nanoid()
    await collection.create<PBUserCode>({
      user: userId,
      code: newUserCode,
    } as PBUserCode)
    console.info('Generated user code %s', newUserCode)
    return newUserCode
  }

  async function resetUserCode(userId: string) {
    const collection = pb.collection(PBCollection.USER_CODE)

    const { id: recordId } = await collection.getFirstListItem<PBUserCode>(
      `user = ${wrapString(userId)}`
    )

    const newUserCode = nanoid()
    console.log('Resetting with new user code %s', newUserCode)
    await collection.update<PBUserCode>(recordId, {
      code: newUserCode,
    } as PBUserCode)

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
