import { defineStore } from 'pinia'
import { Message } from 'src/models/message.interface'

interface MessageStore {
  chatRooms: {
    [chatRoomId: string]: Message[]
  }
}

type InsertLocation = 'start' | 'end'

export const useMessageStore = defineStore('message', {
  state: (): MessageStore => ({
    chatRooms: {},
  }),

  actions: {
    storeMessage(message: Message, location: InsertLocation) {
      const { chatRoomId } = message

      if (!this.chatRooms[chatRoomId]) {
        this.chatRooms[chatRoomId] = []
      }

      const arr = this.chatRooms[chatRoomId]
      if (location === 'end') {
        arr.push(message)
      } else {
        arr.unshift(message)
      }
    },

    storeMessages(location: InsertLocation, ...messages: Message[]) {
      for (const message of messages) {
        this.storeMessage(message, location)
      }
    },

    clearMessages(chatRoomId: string) {
      this.chatRooms[chatRoomId] = []
    },
  },
})
