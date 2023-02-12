export interface Chat {
  id: string
  name: string
  created: Date
  updated: Date
}

export interface ChatMember {
  user: string
  chat: string
  id: string
  created: Date
  updated: Date
}
