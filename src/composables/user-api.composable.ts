import { PBCollection } from 'src/models/pb-collection.enum'
import { PBUserCode } from 'src/models/pb-user-code.interface'
import { usePocketbase } from 'src/services/pocketbase.service'
import { generateShortId } from 'src/utils/id-generate.util'
import { hasPBErrorStatus, wrapString } from 'src/utils/pocketbase.util'

export function useUserCodeAPI() {
  const pb = usePocketbase()

  /**
   * @param code
   * @returns User id associated with the given code
   */
  async function getUserFromUserCode(code: string): Promise<string> {
    const { user } = await pb
      .collection(PBCollection.USER_CODE)
      .getFirstListItem<PBUserCode>(`code = ${wrapString(code)}`)
    return user
  }

  /**
   * Fetches the code of a user.
   * @param userId
   * @returns
   */
  async function getUserCode(userId: string): Promise<string | null> {
    try {
      const { code } = await pb
        .collection(PBCollection.USER_CODE)
        .getFirstListItem<PBUserCode>(`user = ${wrapString(userId)}`)
      return code
    } catch (e) {
      if (hasPBErrorStatus(e, 404)) {
        return null
      }

      // non-404 errors are unexpected, so we have to re-throw them
      throw e
    }
  }

  /**
   * Fetches the code of a user.
   * If the user has not been given a code yet, one will be regenerated.
   * @param userId
   * @returns
   */
  async function prepareUserCode(userId: string) {
    const userCode = await getUserCode(userId)
    if (userCode) {
      return userCode
    }

    console.warn('No user code generated yet. Generating...')
    const newUserCode = generateShortId()
    await pb.collection(PBCollection.USER_CODE).create<PBUserCode>({
      user: userId,
      code: newUserCode,
    } as PBUserCode)
    console.info('Generated user code %s', newUserCode)
    return newUserCode
  }

  /**
   * Resets the code for a given user.
   *
   * @param userId
   * @returns
   */
  async function resetUserCode(userId: string) {
    const collection = pb.collection(PBCollection.USER_CODE)

    const { id: recordId } = await collection.getFirstListItem<PBUserCode>(
      `user = ${wrapString(userId)}`
    )

    const newUserCode = generateShortId()
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
    prepareUserCode,
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
