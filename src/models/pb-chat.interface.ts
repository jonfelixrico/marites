import { BasePBRecord } from './pb-record.interface'

export interface PBChat extends BasePBRecord {
  name: string
  /**
   * Id of the owner who created the chat.
   */
  owner: string
}
