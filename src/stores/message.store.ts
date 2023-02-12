import { defineStore } from 'pinia'
import { ChatMessage } from 'src/models/chat.interface'

interface MessageStore {
  chats: {
    [chatId: string]: ChatMessage[]
  }
}

type InsertLocation = 'start' | 'end'

export const useMessageStore = defineStore('message', {
  state: (): MessageStore => ({
    chats: {},
  }),

  actions: {
    storeMessage(message: ChatMessage, location: InsertLocation) {
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

    storeMessages(location: InsertLocation, ...messages: ChatMessage[]) {
      for (const message of messages) {
        this.storeMessage(message, location)
      }
    },

    clearMessages(chatId: string) {
      this.chats[chatId] = []
    },
  },
})
