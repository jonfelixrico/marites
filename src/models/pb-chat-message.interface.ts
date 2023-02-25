import { BasePbRecord } from './pb-record.interface'

export interface PBChatMessage extends BasePbRecord {
  content: string
  /**
   * Id of the chat the message belongs to.
   */
  chat: string
  /**
   * Id of the user who sent the message.
   */
  sender: string
}
