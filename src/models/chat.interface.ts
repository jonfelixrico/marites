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

export interface ChatMessage {
  content: string
  chat: string
  sender: string
  id: string
  created: Date
  updated: Date
}
