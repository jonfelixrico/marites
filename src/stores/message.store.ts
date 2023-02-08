import { defineStore } from 'pinia'
import { Message } from 'src/models/message.interface'

interface MessageStore {
  chatRooms: {
    [chatRoomId: string]: {
      [messageId: string]: Message
    }
  }
}

export const useMessageStore = defineStore('message', {
  state: (): MessageStore => ({
    chatRooms: {},
  }),

  actions: {
    storeMessage(message: Message) {
      const { chatRoomId } = message

      if (!this.chatRooms[chatRoomId]) {
        this.chatRooms[chatRoomId] = {}
      }

      this.chatRooms[chatRoomId][message.id] = message
    },

    storeMessages(...messages: Message[]) {
      for (const message of messages) {
        this.storeMessage(message)
      }
    },
  },
})
