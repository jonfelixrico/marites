import { BasePBRecord } from './pb-record.interface'

export interface PBChatUserMembership extends BasePBRecord {
  /**
   * Id of the chat.
   */
  chat: string
  /**
   * Id of the user.
   */
  user: string
}
