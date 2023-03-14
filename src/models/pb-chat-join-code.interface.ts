import { BasePBRecord } from './pb-record.interface'

export interface PBChatJoinCode extends BasePBRecord {
  chat: string
  joinCode: string
}
