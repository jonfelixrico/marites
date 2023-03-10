import { defineStore } from 'pinia'
import { PBChatMessage } from 'src/models/pb-chat-message.interface'

interface MessageStore {
  chats: {
    [chatId: string]: PBChatMessage[]
  }
}

type InsertLocation = 'start' | 'end'

export const useMessageStore = defineStore('message', {
  state: (): MessageStore => ({
    chats: {},
  }),

  actions: {
    storeMessage(message: PBChatMessage, location: InsertLocation) {
      const { chat } = message

      if (!this.chats[chat]) {
        this.chats[chat] = []
      }

      const arr = this.chats[chat]
      if (location === 'end') {
        arr.push(message)
      } else {
        arr.unshift(message)
      }
    },

    storeMessages(location: InsertLocation, ...messages: PBChatMessage[]) {
      for (const message of messages) {
        this.storeMessage(message, location)
      }
    },

    clearMessages(chatId: string) {
      this.chats[chatId] = []
    },
  },
})
