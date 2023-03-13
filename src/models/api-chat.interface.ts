import { PBChat } from './pb-chat.interface'

export interface APIChatMember {
  id: string
  username: string
  isOwner?: true
  joined: Date
}

export interface APIChat extends Omit<PBChat, 'owner'> {
  name: string
  members: APIChatMember[]
}
