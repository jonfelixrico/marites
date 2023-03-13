import { BasePBRecord } from './pb-record.interface'

export interface PBChat extends BasePBRecord {
  name: string
  /**
   * Id of the owner who created the chat.
   */
  owner: string

  /**
   * The string that users have to input in "join chat" to be able to join a chat.
   */
  joinCode: string
}
