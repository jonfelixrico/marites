import { BasePbRecord } from './pb-record.interface'

export interface APIChatMember {
  id: string
  username: string
  isOwner?: true
  joined: Date
}

export interface APIChat extends BasePbRecord {
  name: string
  members: APIChatMember[]
}
