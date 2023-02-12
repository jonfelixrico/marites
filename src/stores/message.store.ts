import { defineStore } from 'pinia'
import { ChatMessage } from 'src/models/chat.interface'

interface MessageStore {
  chatRooms: {
    [chatRoomId: string]: ChatMessage[]
  }
}

type InsertLocation = 'start' | 'end'

export const useMessageStore = defineStore('message', {
  state: (): MessageStore => ({
    chatRooms: {},
  }),

  actions: {
    storeMessage(message: ChatMessage, location: InsertLocation) {
      const { chat } = message

      if (!this.chatRooms[chat]) {
        this.chatRooms[chat] = []
      }

      const arr = this.chatRooms[chat]
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

    clearMessages(chatRoomId: string) {
      this.chatRooms[chatRoomId] = []
    },
  },
})
